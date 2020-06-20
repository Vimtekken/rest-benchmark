import Logger from './Logger';
import Request from 'request-promise-native';

const log = new Logger('rb', 'HealthChecker');

export default class Api {
	// Check if service is running. Request throws error if non 2XX status code is returned or other error.
	static async healthcheck(https: boolean, host: string, port: number, path: string): Promise<boolean> {
		try {
			const url = `http${https ? 's' : ''}://${host}:${port}${path}`;
			log.debug(`Healthcheck ${url}`);
			await Request.get({
				url,
				timeout: 1000, // 50 millisecond timeout
			});
			return true;
		} catch (error) {
			log.debug(error);
			return false;
		}
	}
}
