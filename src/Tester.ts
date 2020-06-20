import { SubtestResult, TestResult } from './interfaces/Tests';
import ApacheBench from './ApacheBench';
import Logger from './Logger';
import { Sample } from './interfaces/Sample';
import SystemMetrics from './SystemMetrics';
import TestConfig from './TestConfig';

export default async function tester(name: string, metrics: SystemMetrics, host: string, port: number): Promise<TestResult[]> {
	const results: TestResult[] = [];
	const log = new Logger('rb', name, 'tester');

	for (let testIndex = 0; testIndex < TestConfig.tests.length; testIndex += 1) {
		const test = TestConfig.tests[testIndex];
		log.info('Starting ', test.name, ' test');
		const subtests: SubtestResult[] = [];
		for (let subtestIndex = 0; subtestIndex < test.subtests.length; subtestIndex += 1) {
			const trials: Sample[] = [];
			const subtest = test.subtests[subtestIndex];
			for (let trial = 0; trial < TestConfig.numberOfTrails; trial += 1) {
				log.info('Performing subtest ', subtestIndex, ', trial ', trial);
				const loadTestStartTime = new Date();
				const apacheResult = ApacheBench(host, port, subtest.route, subtest.concurrency, subtest.totalRequestsToSend);
				const loadTestEndTime = new Date();
				const systemStats = await metrics.getMetricForDuration(loadTestStartTime, loadTestEndTime);
				trials.push({
					apache: apacheResult,
					system: systemStats,
				});
			}
			subtests.push({
				config: subtest,
				trials,
			});
		}
		results.push({
			name: test.name,
			subtests,
		});
	}

	return results;
}
