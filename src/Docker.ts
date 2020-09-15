import ApplicationConfig from './interfaces/ApplicationConfig';
import ElasticSearch from './ElasticSearch';
import { execSync } from 'child_process';
import HealthChecker from './HealthChecker';
import Logger from './Logger';
import Utility from './Utility';

const log = new Logger('rb', 'docker');
const waitInterval = 25;

export default class Docker {
	static async awaitHealthy(config: ApplicationConfig, remoteHost: string): Promise<number> {
		const start = Date.now();
		while (!(await HealthChecker.healthcheck(config.https ?? false, remoteHost, config.httpPort ?? 8080, '/healthcheck'))) {
			await Utility.sleep(waitInterval);
		}
		const duration = Date.now() - start;
		ElasticSearch.connection.index({
			index: 'docker_healthy',
			body: {
				config: config.name,
				duration,
			}
		}).then(() => log.info('Wrote elastic docker healthy')).catch((error) => console.error(error));
		return duration;
	}

	static build(config: ApplicationConfig, appLog: Logger): number {
		const start = Date.now();
		appLog.info(config.name, 'Building');
		const source = `${__dirname}/../${config.source}`;
		// Consider using no cache on the build for build time measurements.
		execSync(`docker build -f ${source}/Dockerfile --tag rest-benchmark-${config.name}:latest ${source}`, { stdio: 'pipe' });
		appLog.info(config.name, 'Building complete');
		const duration = Date.now() - start;
		ElasticSearch.connection.index({
			index: 'docker_build',
			body: {
				config: config.name,
				duration,
			}
		}).then(() => log.info('Wrote elastic docker build')).catch((error) => console.error(error));
		return duration;
	}

	static launch(config: ApplicationConfig, appLog: Logger): number {
		Docker.stop(config); // Stop the image first, just in case one lived in a prior run
		const start = Date.now();
		appLog.info(config.name, 'Launching ');
		// --memory=2g --memory-swap=10g
		const cpus = 2; // @todo Make this configurable
		execSync(`docker run -d --cpus=${cpus} -p ${config.httpPort}:${config.httpPort} --name rest-benchmark-${config.name} rest-benchmark-${config.name}:latest`);
		const duration = Date.now() - start;
		ElasticSearch.connection.index({
			index: 'docker_launch',
			body: {
				config: config.name,
				duration,
			}
		}).then(() => log.info('Wrote elastic docker launch')).catch((error) => console.error(error));
		return duration;
	}

	static stop(config: ApplicationConfig): number {
		const start = Date.now();
		let shouldLog = true;
		try {
			execSync(`docker stop rest-benchmark-${config.name} && docker rm rest-benchmark-${config.name}`);
		} catch (error) {
			shouldLog = false;
			// Most likely image didn't already exist
		}
		const duration = Date.now() - start;
		if (shouldLog) {
			ElasticSearch.connection.index({
				index: 'docker_stop',
				body: {
					config: config.name,
					duration,
				}
			}).then(() => log.info('Wrote elastic docker stop')).catch((error) => console.error(error));
		}
		return duration;
	}
}
