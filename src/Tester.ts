import {
	ApacheData,
	ConnectTimeData,
	ConnectTimes,
	DataTransfers,
	RequestData,
} from './interfaces/Apache';
import { SubtestResult, TestResult } from './interfaces/Tests';
import ApacheBench from './ApacheBench';
import Logger from './Logger';
import { Sample } from './interfaces/Sample';
import SystemMetrics from './SystemMetrics';
import TestConfig from './TestConfig';
import Utility from './Utility';

// @todo fix the averages for this. They are going to be approx but not accurate
// Because it is averaged step by step and not over the whole range at once.
function mean(a: number, b: number): number {
	return (a + b) / 2;
}

function mergeConnectTimesData(a: ConnectTimeData, b: ConnectTimeData): ConnectTimeData {
	const merged: ConnectTimeData = a;
	merged.min = Math.min(a.min, a.min);
	merged.mean = mean(a.mean, b.mean);
	merged.sd = mean(a.sd, b.sd);
	merged.min = mean(a.median, b.median);
	merged.max = Math.min(a.max, b.max);
	return merged;
}

function mergeConnectTimes(a: ConnectTimes, b: ConnectTimes): ConnectTimes {
	const merged: ConnectTimes = a;
	merged.connect = mergeConnectTimesData(a.connect, b.connect);
	merged.processing = mergeConnectTimesData(a.processing, b.processing);
	merged.waiting = mergeConnectTimesData(a.waiting, b.waiting);
	merged.total = mergeConnectTimesData(a.total, b.total);
	return merged;
}

function mergeDataTransfers(a: DataTransfers, b: DataTransfers): DataTransfers {
	const merged = a;
	// @todo actually parse string and merge data
	merged.totalTransferred = `${a},${b}`;
	merged.transferRate = `${a},${b}`;
	return merged;
}

function mergeRequestData(a: RequestData, b: RequestData): RequestData {
	const merged = a;
	merged.completed = a.completed + b.completed;
	merged.duration = Math.max(a.duration, b.duration);
	merged.failed = a.failed + b.failed;
	merged.non2xx = a.non2xx + b.non2xx;
	merged.rps = a.rps + b.rps;
	merged.timePerRequest = mean(a.timePerRequest, b.timePerRequest);
	return merged;
}

function mergeApacheData(data: (ApacheData | null)[]): ApacheData | null {
	const filteredData = (data || []).filter((d) => d) as ApacheData[];
	if (filteredData.length <= 0) {
		return null;
	}
	const current = filteredData[0];
	for (let i = 1; i < filteredData.length; i += 1) {
		const next = filteredData[i];
		current.connect = mergeConnectTimes(current.connect, next.connect);
		current.data = mergeDataTransfers(current.data, next.data);
		current.requests = mergeRequestData(current.requests, next.requests);
	}
	return current;
}

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
				await Utility.sleep(1000);
				const loadTestStartTime = new Date();
				const dataPromises: Promise<ApacheData | null>[] = [];
				for (let process = 0; process < subtest.parallelProcesses; process += 1) {
					dataPromises.push(ApacheBench(
						host,
						port,
						subtest.route,
						subtest.concurrency,
						subtest.totalRequestsToSend / subtest.parallelProcesses,
						subtest.keepAlive,
					));
				}
				const apacheData: (ApacheData | null)[] = await Promise.all(dataPromises);
				const loadTestEndTime = new Date();
				const systemStats = await metrics.getMetricForDuration(loadTestStartTime, loadTestEndTime);
				trials.push({
					apache: mergeApacheData(apacheData),
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
