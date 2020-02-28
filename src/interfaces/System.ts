
export interface MinMaxAvg {
	min: number;
	max: number;
	average: number;
}

export interface CpuData {
	system: MinMaxAvg;
	user: MinMaxAvg;
}

export interface KernelData {
	contextSwitches: number;
	interrupts: number;
	processesForked: number;
}

export interface MemoryData {
	available: MinMaxAvg;
	availablePercent: MinMaxAvg;
	free: MinMaxAvg;
	used: MinMaxAvg;
	usedPercent: MinMaxAvg;
}

export interface SystemData {
	cpu: CpuData;
	kernel: KernelData;
	memory: MemoryData;
}
