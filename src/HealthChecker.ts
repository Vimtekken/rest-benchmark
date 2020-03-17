import Debug from 'debug';
import Request from 'request-promise-native';

const debug = Debug('rest-eb:HealthChecker');

export default class Api {
	// Check if service is running. Request throws error if non 2XX status code is returned or other error.
	static async healthcheck(https: boolean, host: string, port: number, path: string): Promise<boolean> {
		setInterval(() => console.log('Interval'), 10000);
		try {
			const url = `http${https ? 's' : ''}://${host}:${port}${path}`;
			console.log(`Healthcheck ${url}`);
			await Request.get({
				url,
				timeout: 1000, // 50 millisecond timeout
			});
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}