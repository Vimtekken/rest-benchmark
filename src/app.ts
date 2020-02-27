import { execSync } from 'child_process';
import fs from 'fs';

import ApacheBench from './ApacheBench';
import Api from './Api';
import Monitoring from './Monitoring';

interface ApplicationConfig {
	name: string;
	source: string;
	httpPort: number;
	https: boolean;
}

// Pull the docker target for the test
const defaultPort = 8080;
const remoteHost = process.env.REMOTE_HOST || '';
const remoteUser = process.env.REMOTE_USER;
const remotePassword = process.env.REMOTE_PASSWORD;
const remoteSshPort = process.env.REMOTE_SSH_PORT || 22;

// Require host
if (!remoteHost) {
	console.error('Missing remote hostname.');
	process.exit(1);
}

async function switchToAsync() {
	// Following remote host code disabled for the time being.
	// Determine execution mode
	// const dockerCommandMode: boolean = remoteUser != null && remotePassword != null;
	// if (dockerCommandMode) {
	// 	console.log('Running in docker command mode.');
	// 	// process.env.DOCKER_HOST = `ssh://${remoteUser}@${remoteHost}:${remoteSshPort}`;
	// } else {
	// 	console.log('Missing remote user or password. Running in test mode only.');
	// }

	// Launch the monitoring services on the remote host.
	console.log('Launching monitoring');
	try {
		Monitoring.stop(); // Close any previous containers first.
	} catch (error) {
		// Failed to stop containers. Probably don't exist this time.
	}
	Monitoring.start();

	console.log('Loading application config');
	const applicationConfigRaw = fs.readFileSync(`${__dirname}/applications_config.json`, { encoding: 'utf-8' });
	if (!applicationConfigRaw) {
		console.error('Could not find applications config file');
		process.exit(1);
	}
	const applicationConfig: ApplicationConfig[] = JSON.parse(applicationConfigRaw);
	console.log('Application config ', applicationConfig);

	// Filter for application name or use all applications
	if (process.argv?.length > 2) {
		const apps: string[] = process.argv.slice(2);
		console.log('Testing applications ', apps);
		Object.keys(applicationConfig).forEach((key) => {
			if (!apps.includes(applicationConfig[key].name)) {
				delete applicationConfig[key];
			}
		});
	} else {
		console.log('Testing applications: ', applicationConfig.map((config) => config.name));
	}

	function sleep(milliseconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	} 

	// Start the tests, We use this type of loop here so we can make sure all async calls are handled in order sequentially
	for (let i = 0; i < applicationConfig.length; i += 1) {
		const config = applicationConfig[i];

		// Build the target application
		const buildStart = new Date();
		console.log('Building ', config.name);
		const source = `${__dirname}/../${config.source}`;
		// Consider using no cache on the build for build time measurements.
		execSync(`docker build -f ${source}/Dockerfile --tag rest-benchmark-${config.name}:latest ${source}`);
		console.log('Building complete');
		const buildEnd = new Date();

		// Run test on application
		// Start app docker container
		const launchTime = new Date();
		console.log('Launching ', config.name);
		execSync(`docker run -d --name rest-benchmark-${config.name} rest-benchmark-${config.name}:latest`);
		const dockerTime = new Date();

		// Wait for healthcheck to make sure the service is running
		console.log('Waiting for ', config.name, ' to become healthy');
		const healthyTimeout = setTimeout(() => {
			console.error(`Application ${config.name} failed to become healthy in the alotted time`);
			execSync(`docker stop rest-benchmark-${config.name} && docker rm rest-benchmark-${config.name}`);
			process.exit(1);
		}, 15000); // 15 seconds from image launch to becoming healthy.
		while(!(await Api.healthcheck(config.https ?? false, remoteHost, config.httpPort ?? 8080, '/healthcheck'))) {
			await sleep(50);
		}
		clearTimeout(healthyTimeout);
		const healthyTime = new Date();
		console.log(config.name, ' healthy. Collecting idle data');

		// Let it idle out to get past init load and also measure idle load
		await sleep(5000);

		// Do load test
		console.log('Starting load tests');
		const loadTestStartTime = new Date();
		const loadTestEndTime = new Date();

		// Close container.
		console.log('Stopping ', config.name);
		execSync(`docker stop rest-benchmark-${config.name} && docker rm rest-benchmark-${config.name}`);
	};

	// Close resources
	console.log('Stopping monitoring');
	Monitoring.stop();

	console.log('Load Test Complete');
}

switchToAsync();
