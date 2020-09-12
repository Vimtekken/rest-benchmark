import * as Sample from './Sample';

export interface TestSampleConfig {
	concurrency: number;
	cpuAllocationPercent: number; // (0, 1)
	keepAlive: boolean;
	parallelProcesses: number;
	route: string;
	totalRequestsToSend: number;
}

export interface SingleTestConfig {
	name: string;
	subtests: TestSampleConfig[];
}

export interface TestConfig {
	numberOfTrails: number;
	tests: SingleTestConfig[];
}

export interface SubtestResult {
	config: TestSampleConfig;
	trials: Sample.Sample[];
}

export interface TestResult {
	name: string; // Name of test
	subtests: SubtestResult[];
}
