import Debug from 'debug';

import ApacheBench from './ApacheBench';
import { Sample } from './interfaces/Sample';
import { SubtestResult } from './interfaces/Tests';
import SystemMetrics from './SystemMetrics';
import { TestResult } from './interfaces/Tests';
import TestConfig from './TestConfig';

export default async function(parentDebug: Debug.Debugger, metrics: SystemMetrics, host: string, port: number): Promise<TestResult[]> {
	const results: TestResult[] = [];
	const debug = parentDebug.extend('tester');

	for(let testIndex = 0; testIndex < TestConfig.tests.length; testIndex += 1) {
		const test = TestConfig.tests[testIndex];
		debug('Starting ', test.name, ' test');
		const subtests: SubtestResult[] = [];
		for (let subtestIndex = 0; subtestIndex < test.subtests.length; subtestIndex += 1) {
			const trials: Sample[] = [];
			const subtest = test.subtests[subtestIndex];
			for (let trial = 0; trial < TestConfig.numberOfTrails; trial += 1) {
				debug('Performing subtest ', subtestIndex, ', trial ', trial);
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
		};
		results.push({
			name: test.name,
			subtests,
		})
	};

	return results;
}
