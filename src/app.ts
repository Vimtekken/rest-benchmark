import Debug from 'debug';
import { execSync } from 'child_process';
import fs from 'fs';

import Api from './HealthChecker';
import ApplicationConfig from './ApplicationConfig';
import { ApplicationReport } from './interfaces/ServerReport';
import { SystemData } from './interfaces/System';
import Monitoring from './monitoring';
import SystemMetrics from './SystemMetrics';
import Tester from './Tester';
import Utility from './Utility';
import Writer from './Writer';

const debug = Debug('rb');

// Pull the docker target for the test
const remoteHost = process.env.REMOTE_HOST || '';

// Require host
if (!remoteHost) {
	console.error('Missing remote hostname.');
	process.exit(1);
}

async function switchToAsync() {
	// Launch the monitoring services on the remote host.
	debug('Launching monitoring');
	Monitoring.start();

	// Create system metrics instance
	const metrics = new SystemMetrics(remoteHost);
	debug('Waiting for monitoring containers to fully boot ...');
	await metrics.initComplete;

	// Filter for application name or use all applications
	if (process.argv?.length > 2) {
		const apps: string[] = process.argv.slice(2);
		debug('Testing applications ', apps);
		Object.keys(ApplicationConfig).forEach((key) => {
			if (!apps.includes(ApplicationConfig[key].name)) {
				delete ApplicationConfig[key];
			}
		});
	} else {
		debug('Testing applications: ', ApplicationConfig.map((config) => config.name));
	}

	// Start the tests, We use this type of loop here so we can make sure all async calls are handled in order sequentially
	const applicationReports: ApplicationReport[] = [];
	for (let i = 0; i < ApplicationConfig.length; i += 1) {
		const config = ApplicationConfig[i];
		const appDebug = debug.extend(config.name);

		// Build the target application
		const buildStart = new Date();
		appDebug(config.name, 'Building');
		const source = `${__dirname}/../${config.source}`;
		// Consider using no cache on the build for build time measurements.
		execSync(`docker build -f ${source}/Dockerfile --tag rest-benchmark-${config.name}:latest ${source}`);
		appDebug(config.name, 'Building complete');
		const buildEnd = new Date();

		// Run test on application
		// Start app docker container
		const launchTime = new Date();
		appDebug(config.name, 'Launching ');
		execSync(`docker run -d -p ${config.httpPort}:${config.httpPort} --name rest-benchmark-${config.name} rest-benchmark-${config.name}:latest`);
		const dockerTime = new Date();

		// Wait for healthcheck to make sure the service is running
		appDebug(config.name, 'Waiting for to become healthy');
		// const healthyTimeout = setTimeout(() => {
		// 	console.error(`Application ${config.name} failed to become healthy in the alotted time`);
		// 	execSync(`docker stop rest-benchmark-${config.name} && docker rm rest-benchmark-${config.name}`);
		// 	process.exit(1);
		// }, 30000); // 15 seconds from image launch to becoming healthy.
		while(!(await Api.healthcheck(config.https ?? false, remoteHost, config.httpPort ?? 8080, '/healthcheck'))) {
			await Utility.sleep(25);
		}
		// clearTimeout(healthyTimeout);
		const healthyTime = new Date();
		appDebug(config.name, 'Healthy. Collecting idle data');

		// Let it idle out to get past init load and also measure idle load
		await Utility.sleep(5000);
		const idleMetrics: SystemData = await metrics.getMetricForDuration(healthyTime, new Date());

		// Do load test
		appDebug(config.name, 'Starting load tests');
		const tests = await Tester(appDebug, metrics, remoteHost, config.httpPort);
		appDebug(config.name, 'Load tests complete');

		// Close container.
		appDebug(config.name, 'Shutting Down');
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
			tests,
		};
		applicationReports.push(report);
	};

	// Wrtie report data to output
	Writer(applicationReports);

	// Close resources
	debug('Stopping monitoring');
	Monitoring.stop();

	debug('Load Test Complete');
}

switchToAsync();
