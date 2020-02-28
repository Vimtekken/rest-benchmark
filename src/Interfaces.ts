
// Application interfaces
export interface ApplicationConfig {
	name: string;
	source: string;
	httpPort: number;
	https: boolean;
}

// Apache Data
export interface ConnectTimeData {
	min: number;
	mean: number;
	sd: number;
	median: number;
	max: number;
}

export interface ConnectTimes {
	connect: ConnectTimeData;
	processing: ConnectTimeData;
	waiting: ConnectTimeData;
	total: ConnectTimeData;
}

export interface DataTransfers {
	totalTransferred: string;
	transferRate: string;
}

export interface RequestData {
	completed: number;
	duration: number;
	failed: number;
	non2xx: number;
	rps: number;
	timePerRequest: number;
}

export interface ApacheData {
	connect: ConnectTimes;
	data: DataTransfers;
	requests: RequestData;
}

// System metrics
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

// Full data sample
export interface Sample {
	apache: ApacheData | null;
	system: SystemData;
}

export interface ApplicationReport {
	buildTime: number;
	idle: SystemData;
	launchTime: number;
	healthTime: number;
	stopTime: number;
}