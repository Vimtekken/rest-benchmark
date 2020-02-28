import * as Apache from './Apache';
import * as System from './System';

export interface Sample {
	apache: Apache.ApacheData | null;
	system: System.SystemData;
}

export interface ApplicationReport {
	buildTime: number;
	idle: System.SystemData;
	launchTime: number;
	healthTime: number;
	stopTime: number;
}
