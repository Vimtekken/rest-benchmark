import * as Apache from './Apache';
import * as System from './System';
import { HeyData } from '../benchmarkers/Hey';
import { WeighttpData } from '../benchmarkers/Weighttp';

export interface Sample {
	apache?: Apache.ApacheData;
	bench?: WeighttpData;
	hey?: HeyData;
	system: System.SystemData;
}
