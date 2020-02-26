import { execSync } from 'child_process';
import fs from 'fs';

import ApacheBench from './ApacheBench';
import Monitoring from './Monitoring';

interface ApplicationConfig {
	name: string;
	source: string;
	httpPort: number;
	https: boolean;
}

// Pull the docker target for the test
const defaultPort = 8080;
const remoteHost = process.env.REMOTE_HOST;
const remoteUser = process.env.REMOTE_USER;
const remotePassword = process.env.REMOTE_PASSWORD;
const remoteSshPort = process.env.REMOTE_SSH_PORT || 22;

// Require host
if (!remoteHost) {
	console.error('Missing remote hostname.');
	process.exit(1);
}

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

// Start the tests
applicationConfig.forEach((config) => {
	// Build the target application
	console.log('Building ', config.name);
	const source = `${__dirname}/../${config.source}`;
	execSync(`docker build -f ${source}/Dockerfile --tag rest-benchmark-${config.name}:latest ${source}`);
	console.log('Building complete');

	// Run test on application
	// Start app docker container
	// Wait for healthcheck
	// Do load test
	// Close container.
});

// Close resources
console.log('Stopping monitoring');
Monitoring.stop();

console.log('Load Test Complete');
