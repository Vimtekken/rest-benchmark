import dotenv from 'dotenv';
import { LogLevelDesc } from 'loglevel';

dotenv.config({ path: `./envs/${process.env.NODE_ENV}.env` });

export default class Environment {
	static readonly REMOTE_HOST: string = process.env.REMOTE_HOST || '';

	static readonly LOG_LEVEL: LogLevelDesc = (process.env.LOG_LEVEL || 'info') as LogLevelDesc;
}
