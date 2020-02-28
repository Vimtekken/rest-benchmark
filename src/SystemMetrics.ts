import * as Influx from 'influx';

import { MemoryData, CpuData, KernelData, SystemData } from './interfaces/System';
import Utility from './Utility';

export default class SystemMetrics {
	influx: Influx.InfluxDB | null = null;

	initComplete: Promise<void> | null = null;

	static readonly MAX_ATTEMPTS: number = 120;

	constructor(host: string, port: number = 8086) {
		this.createConnection(host, port);
	}

	protected createConnection(host: string, port: number): void {
		this.initComplete = new Promise((resolve, reject) => {
			this.initConnection(host, port, resolve, reject, 0);
		});
	}

	protected async initConnection(host: string, port: number, resolve, reject, attempt: number) {
		try {
			this.influx = new Influx.InfluxDB({
				host,
				port,
				database: 'telegraf',
				schema: [
					{
						measurement: 'cpu',
						fields: {
							ankle: Influx.FieldType.FLOAT,
						},
						tags: [
						],
					},
				],
			});
			
			resolve();
		} catch (error) {
			if (attempt < SystemMetrics.MAX_ATTEMPTS) {
				await Utility.sleep(500);
				console.log(error);
				this.initConnection(host, port, resolve, reject, attempt + 1);
			} else {
				reject(error);
			}
		}
	}
 // diskio, mem
	async getCpuDataForDuration(startTime: Date, endTime: Date): Promise<CpuData> {
		const raw1 = await this.influx?.query(`
			select * from mem
			where time >= '${startTime.toISOString()}' and time <= '${endTime.toISOString()}'
			order by time desc;
		`);

		// console.log(raw1);

		const raw = await this.influx?.query(`
			select * from cpu
			where cpu = 'cpu-total' and time >= '${startTime.toISOString()}' and time <= '${endTime.toISOString()}'
			order by time desc;
		`);

		let systemMin: number = 0;
		let systemMax: number = 0;
		let systemAverage: number = 0;
		let userMin: number = 0;
		let userMax: number = 0;
		let userAverage: number = 0;

		raw?.forEach((row: any) => {
			if (row.usage_system < systemMin) {
				systemMin = row.usage_system;
			}
			if (row.usage_system > systemMax) {
				systemMax = row.usage_system;
			}
			systemAverage += row.usage_system;
			if (row.usage_user < userMin) {
				userMin = row.usage_user;
			}
			if (row.usage_user > userMax) {
				userMax = row.usage_user;
			}
			userAverage += row.usage_user;
		});

		systemAverage /= (raw as any).length;
		userAverage /= (raw as any).length;

		return {
			system: {
				min: systemMin,
				max: systemMax,
				average: systemAverage,
			},
			user: {
				min: userMin,
				max: userMax,
				average: userAverage,
			},
		};
	}

	async getKernelDataForDuration(startTime: Date, endTime: Date): Promise<KernelData> {
		const raw = await this.influx?.query(`
			select * from kernel
			where time >= '${startTime.toISOString()}' and time <= '${endTime.toISOString()}'
			order by time desc;
		`);

		const end = (raw as any)[0];
		const begin = (raw as any)[(raw as any).length - 1];

		return {
			contextSwitches: raw && raw.length > 0 ? end.context_switches - begin.context_switches : 0,
			interrupts: raw && raw.length > 0 ? end.interrupts - begin.interrupts : 0,
			processesForked: raw && raw.length > 0 ? end.processes_forked - begin.processes_forked : 0,
		}
	}

	async getMemoryDataForDuration(startTime: Date, endTime: Date): Promise<MemoryData> {
		const raw = await this.influx?.query(`
			select * from mem
			where time >= '${startTime.toISOString()}' and time <= '${endTime.toISOString()}'
			order by time desc;
		`);

		const memoryData: MemoryData = {
			available: {
				min: Number.MAX_SAFE_INTEGER,
				max: Number.MIN_SAFE_INTEGER,
				average: 0,
			},
			availablePercent: {
				min: Number.MAX_SAFE_INTEGER,
				max: Number.MIN_SAFE_INTEGER,
				average: 0,
			},
			free: {
				min: Number.MAX_SAFE_INTEGER,
				max: Number.MIN_SAFE_INTEGER,
				average: 0,
			},
			used: {
				min: Number.MAX_SAFE_INTEGER,
				max: Number.MIN_SAFE_INTEGER,
				average: 0,
			},
			usedPercent: {
				min: Number.MAX_SAFE_INTEGER,
				max: Number.MIN_SAFE_INTEGER,
				average: 0,
			},
		};

		raw?.forEach((row: any) => {
			if (row.available < memoryData.available.min) {
				memoryData.available.min = row.available;
			}
			if (row.available > memoryData.available.max) {
				memoryData.available.max = row.available;
			}
			memoryData.available.average += row.available;

			if (row.available_percent < memoryData.availablePercent.min) {
				memoryData.availablePercent.min = row.available_percent;
			}
			if (row.available_percent > memoryData.availablePercent.max) {
				memoryData.availablePercent.max = row.available_percent;
			}
			memoryData.availablePercent.average += row.available_percent;

			if (row.free < memoryData.free.min) {
				memoryData.free.min = row.free;
			}
			if (row.free > memoryData.free.max) {
				memoryData.free.max = row.free;
			}
			memoryData.free.average += row.free;

			if (row.used < memoryData.used.min) {
				memoryData.used.min = row.used;
			}
			if (row.used > memoryData.used.max) {
				memoryData.used.max = row.used;
			}
			memoryData.used.average += row.used;

			if (row.used_percent < memoryData.usedPercent.min) {
				memoryData.usedPercent.min = row.used_percent;
			}
			if (row.used_percent > memoryData.usedPercent.max) {
				memoryData.usedPercent.max = row.used_percent;
			}
			memoryData.usedPercent.average += row.used_percent;
		});

		const length = raw?.length || 0;
		memoryData.available.average /= length;
		memoryData.availablePercent.average /= length;
		memoryData.free.average /= length;
		memoryData.used.average /= length;
		memoryData.usedPercent.average /= length;

		return memoryData;
	}

	async getMetricForDuration(startTime: Date, endTime: Date): Promise<SystemData> {
		await this.initComplete;
		return {
			cpu: await this.getCpuDataForDuration(startTime, endTime),
			kernel: await this.getKernelDataForDuration(startTime, endTime),
			memory: await this.getMemoryDataForDuration(startTime, endTime),
		};
	}
}