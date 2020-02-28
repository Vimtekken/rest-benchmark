import Debug from 'debug';
import Request from 'request-promise-native';

const debug = Debug('rest-benchmark:Api');

export default class Api {
	// Check if service is running. Request throws error if non 2XX status code is returned or other error.
	static async healthcheck(https: boolean, host: string, port: number, path: string): Promise<boolean> {
		try {
			const url = `http${https ? 's' : ''}://${host}:${port}${path}`;
			await Request.get({
				url,
				timeout: 50, // 50 millisecond timeout
			});
			return true;
		} catch (error) {
			debug(error);
			return false;
		}
	}
}