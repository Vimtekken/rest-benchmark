import ApplicationConfig from './interfaces/ApplicationConfig';
import { execSync } from 'child_process';
import HealthChecker from './HealthChecker';
import Logger from './Logger';
import Postgres from './postgres';
import Utility from './Utility';

const waitInterval = 25;

export default class Docker {
	static async awaitHealthy(config: ApplicationConfig, remoteHost: string): Promise<number> {
		const start = Date.now();
		while (!(await HealthChecker.healthcheck(config.https ?? false, remoteHost, config.httpPort ?? 8080, '/healthcheck'))) {
			await Utility.sleep(waitInterval);
		}
		const duration = Date.now() - start;
		Postgres.connection.raw('INSERT INTO docker_healthy (config_name, duration) VALUES (:name, :duration)', { name: config.name, duration })
			.then(() => console.log('Success inserting into docker_healthy'))
			.catch((error) => console.log(error));
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
		Postgres.connection.raw('INSERT INTO docker_build (config_name, duration) VALUES (:name, :duration)', { name: config.name, duration })
			.then(() => console.log('Success inserting into docker_build'))
			.catch((error) => console.log(error));
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
		Postgres.connection.raw('INSERT INTO docker_launch (config_name, duration) VALUES (:name, :duration)', { name: config.name, duration })
			.then(() => console.log('Success inserting into docker_launch'))
			.catch((error) => console.log(error));
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
			Postgres.connection.raw('INSERT INTO docker_stop (config_name, duration) VALUES (:name, :duration)', { name: config.name, duration })
				.then(() => console.log('Success inserting into docker_stop'))
				.catch((error) => console.log(error));
		}
		return duration;
	}
}
