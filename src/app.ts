import ApplicationConfig from './interfaces/ApplicationConfig';
import { ApplicationReport } from './interfaces/ServerReport';
import DefaultAppConfig from './consts/ApplicationConfig';
import Docker from './Docker';
import ElasticSearch from './ElasticSearch';
import Environment from './consts/Environment';
import Kibana from './Kibana';
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

function getApplicationConfigs(): ApplicationConfig[] {
	if (process.argv?.length > 2) {
		const apps: string[] = process.argv.slice(2);
		log.info('Testing applications ', apps);
		return DefaultAppConfig.filter((config) => apps.indexOf(config.name) >= 0);
	}
	log.info('Testing applications: ', DefaultAppConfig.map((config) => config.name));
	return DefaultAppConfig;
}

async function testConfig(config: ApplicationConfig, metrics: SystemMetrics): Promise<ApplicationReport> {
	log.debug('Running tests for config:', config);
	const appLog = new Logger('rb', config.name);

	// Docker build + launch
	const buildTime = Docker.build(config, appLog);
	const launchTime = Docker.launch(config, appLog);

	// Wait for healthcheck to make sure the service is running
	appLog.info(config.name, 'Waiting for to become healthy');
	const healthTime = await Docker.awaitHealthy(config, remoteHost);
	appLog.info(config.name, 'Healthy. Collecting idle data');

	// Let it idle out to get past init load and also measure idle load
	const preSleepTime = new Date();
	await Utility.sleep(5000);
	const idleMetrics: SystemData = await metrics.getMetricForDuration(preSleepTime, new Date());

	// Do load test
	appLog.info(config.name, 'Starting load tests');
	const tests = await Tester(config.name, metrics, remoteHost, config.httpPort);
	appLog.info(config.name, 'Load tests complete');

	// Close container.
	appLog.info(config.name, 'Shutting Down');
	const stopTime = Docker.stop(config);

	return {
		application: config.name,
		buildTime,
		idle: idleMetrics,
		launchTime,
		healthTime,
		stopTime,
		// @todo Add a total time
		tests,
	};
}

async function switchToAsync() {
	process.on('beforeExit', () => {
		Monitoring.stop();
	});

	log.info('Launching Results Database');
	ElasticSearch.start();
	Kibana.stop();
	await ElasticSearch.waitForHealth();

	// Launch the monitoring services on the remote host.
	log.info('Launching monitoring');
	Monitoring.start();

	// Create system metrics instance
	const metrics = new SystemMetrics(remoteHost);
	log.info('Waiting for monitoring containers to fully boot ...');
	await metrics.initComplete;

	// Get our run config
	const applicationConfigurations = getApplicationConfigs();

	// Start the tests, We use this type of loop here so we can make sure all async calls are handled in order sequentially
	const applicationReports: ApplicationReport[] = [];
	for (let i = 0; i < applicationConfigurations.length; i += 1) {
		applicationReports.push(await testConfig(applicationConfigurations[i], metrics));
	}

	// Wrtie report data to output
	Writer(applicationReports);
	log.info('Load Test Complete');

	// Close resources
	log.info('Stopping monitoring');
	Monitoring.stop();

	log.info('Launching Kibana Visualizer. This may take a while...');
	Kibana.start(remoteHost);
	await Kibana.pushDashboards(remoteHost);
	log.info(`Kibana finished launching at http://${remoteHost}:5601`);
}

switchToAsync();
