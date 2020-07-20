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
