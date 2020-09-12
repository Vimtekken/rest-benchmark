import Api from './HealthChecker';
import ApplicationConfig from './ApplicationConfig';
import { ApplicationReport } from './interfaces/ServerReport';
import Environment from './Environment';
import { execSync } from 'child_process';
import Logger from './Logger';
import Monitoring from './monitoring';
import { SystemData } from './interfaces/System';
import SystemMetrics from './SystemMetrics';
import Tester from './Tester';
import Utility from './Utility';
import Writer from './Writer';

const log = new Logger('rb');

// Pull the docker target for the test
const remoteHost = Environment.REMOTE_HOST;

// Require host
if (!remoteHost) {
	console.error('Missing remote hostname.');
	process.exit(1);
}

async function switchToAsync() {
	process.on('beforeExit', () => {
		Monitoring.stop();
	});

	// Launch the monitoring services on the remote host.
	log.info('Launching monitoring');
	Monitoring.stop();
	Monitoring.start();

	// Create system metrics instance
	const metrics = new SystemMetrics(remoteHost);
	log.info('Waiting for monitoring containers to fully boot ...');
	await metrics.initComplete;

	// Filter for application name or use all applications
	if (process.argv?.length > 2) {
		const apps: string[] = process.argv.slice(2);
		log.debug('Testing applications ', apps);
		Object.keys(ApplicationConfig).forEach((key) => {
			if (!apps.includes(ApplicationConfig[key].name)) {
				delete ApplicationConfig[key];
			}
		});
	} else {
		log.debug('Testing applications: ', ApplicationConfig.map((config) => config.name));
	}

	// Start the tests, We use this type of loop here so we can make sure all async calls are handled in order sequentially
	const applicationReports: ApplicationReport[] = [];
	for (let i = 0; i < ApplicationConfig.length; i += 1) {
		const config = ApplicationConfig[i];
		const appLog = new Logger('rb', config.name);

		// Build the target application
		const buildStart = new Date();
		appLog.info(config.name, 'Building');
		const source = `${__dirname}/../${config.source}`;
		// Consider using no cache on the build for build time measurements.
		execSync(`docker build -f ${source}/Dockerfile --tag rest-benchmark-${config.name}:latest ${source}`, { stdio: 'pipe' });
		appLog.info(config.name, 'Building complete');
		const buildEnd = new Date();

		// Run test on application
		// Start app docker container
		const launchTime = new Date();
		appLog.info(config.name, 'Launching ');
		try {
			execSync(`docker container rm -f rest-benchmark-${config.name}`);
		} catch (error) {
			// Most likely image didn't already exist
		}
		// --memory=2g --memory-swap=10g
		execSync(`docker run -d --cpus=2 -p ${config.httpPort}:${config.httpPort} --name rest-benchmark-${config.name} rest-benchmark-${config.name}:latest`);
		const dockerTime = new Date();

		// Wait for healthcheck to make sure the service is running
		appLog.info(config.name, 'Waiting for to become healthy');
		while (!(await Api.healthcheck(config.https ?? false, remoteHost, config.httpPort ?? 8080, '/healthcheck'))) {
			await Utility.sleep(25);
		}
		// clearTimeout(healthyTimeout);
		const healthyTime = new Date();
		appLog.info(config.name, 'Healthy. Collecting idle data');

		// Let it idle out to get past init load and also measure idle load
		await Utility.sleep(5000);
		const idleMetrics: SystemData = await metrics.getMetricForDuration(healthyTime, new Date());

		// Do load test
		appLog.info(config.name, 'Starting load tests');
		const tests = await Tester(config.name, metrics, remoteHost, config.httpPort);
		appLog.info(config.name, 'Load tests complete');

		// Close container.
		appLog.info(config.name, 'Shutting Down');
		const shutdownTime = new Date();
		execSync(`docker stop rest-benchmark-${config.name} && docker rm rest-benchmark-${config.name}`);
		const dockerStopTime = new Date();

		const report: ApplicationReport = {
			application: config.name,
			buildTime: buildEnd.getTime() - buildStart.getTime(),
			idle: idleMetrics,
			launchTime: dockerTime.getTime() - launchTime.getTime(),
			healthTime: healthyTime.getTime() - dockerTime.getTime(),
			stopTime: dockerStopTime.getTime() - shutdownTime.getTime(),
			// @todo Add a total time
			tests,
		};
		applicationReports.push(report);
	}

	// Wrtie report data to output
	Writer(applicationReports);

	// Close resources
	log.info('Stopping monitoring');
	Monitoring.stop();

	log.info('Load Test Complete');
}

switchToAsync();
