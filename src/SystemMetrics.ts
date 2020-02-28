import * as Influx from 'influx';

import Utility from './Utility';

interface CpuData {
	system: {
		min: number;
		max: number;
		average: number;
	};
	user: {
		min: number;
		max: number;
		average: number;
	};
}

interface SystemData {
	cpu: CpuData;
}

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

	async getCpuDataForDuration(startTime: Date, endTime: Date): Promise<CpuData> {
		const raw = await this.influx?.query(`
			select * from cpu
			where cpu = 'cpu-total' and time >= '${startTime.toISOString()}' and time <= '${endTime.toISOString()}'
			order by time desc;
		`);
		console.log((raw as any).length);

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

	async getMetricForDuration(startTime: Date, endTime: Date): Promise<SystemData> {
		await this.initComplete;
		return {
			cpu: await this.getCpuDataForDuration(startTime, endTime),
		};
	}
}