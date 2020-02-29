import * as Apache from './Apache';
import * as System from './System';

export interface Sample {
	apache: Apache.ApacheData | null;
	system: System.SystemData;
}
