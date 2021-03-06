import * as System from './System';
import * as Tests from './Tests';

export interface ApplicationReport {
	application: string;
	buildTime: number;
	idle: System.SystemData;
	launchTime: number;
	healthTime: number;
	stopTime: number;
	tests: Tests.TestResult[];
}
