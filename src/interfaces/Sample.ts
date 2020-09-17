import * as Apache from './Apache';
import * as System from './System';
import { WeighttpData } from '../benchmarkers/Weighttp';

export interface Sample {
	apache?: Apache.ApacheData;
	bench?: WeighttpData;
	system: System.SystemData;
}
