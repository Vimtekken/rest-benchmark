import * as Tests from './interfaces/Tests';
import { ApplicationReport } from './interfaces/ServerReport';
import fs from 'fs';
import { parse } from 'json2csv';
import Utility from './Utility';

interface ProcessedReports {
	application: string;
	rpsMax: {
		max: number;
		config: Tests.SingleTestConfig;
	};
	rps: {
		[test: string]: {
			[subtest: number]: number;
		}
	}
}

function processData(reports: ApplicationReport[]): ProcessedReports[] {
	const processedReports: any[] = [];

	reports.forEach((report) => {
		let maxRps = 0;
		let config: Tests.TestSampleConfig | null = null;
		const newReport: any = {
			application: report.application,
			rps: {},
		};

		report.tests.forEach((test) => {
			newReport.rps[`test-${test.name}`] = {} as any;
			for (let i = 0; i < test.subtests.length; i += 1) {
				const subtest = test.subtests[i];
				let subtestMaxRps = 0;
				const allSubRps: number[] = [];
				subtest.trials.forEach((trial) => {
					allSubRps.push(trial.apache?.requests.rps || 0);
					if ((trial.apache?.requests.rps || 0) > maxRps) {
						maxRps = trial.apache?.requests.rps || 0;
						config = subtest.config; // eslint-disable-line prefer-destructuring
					}
					if ((trial.apache?.requests.rps || 0) > subtestMaxRps) {
						subtestMaxRps = trial.apache?.requests.rps || 0;
					}
				});
				console.log(
					`Max rps on ${report.application} for subtest test-${test.name} `,
					subtestMaxRps,
					'average',
					Utility.math.average(allSubRps),
					'deviation',
					Utility.math.standardDeviation(allSubRps),
				);
				newReport.rps[`test-${test.name}`][i] = subtestMaxRps;
			}
		});
		newReport.rpsMax = {
			max: maxRps,
			config,
		};
		processedReports.push(newReport);
	});

	return processedReports;
}

export function writeReportsOld(reports: ApplicationReport[]): void {
	const opts = {
		flatten: true,
	};

	// Process the data
	const processedData = processData(reports);
	fs.writeFileSync('/out/out-processed.json', JSON.stringify(processedData), { encoding: 'utf-8' });
	fs.writeFileSync('/out/out-processed.csv', parse(processedData, opts), { encoding: 'utf-8' });

	// Write json out
	fs.writeFileSync('/out/out-raw.json', JSON.stringify(reports), { encoding: 'utf-8' });

	// Write Raw
	const csvData = Array.from(reports) as any[];
	csvData.forEach((report) => {
		const newTests: any = {};
		report.tests.forEach((test) => {
			const newSubtests: any = {};
			test.subtests.forEach((subtest) => {
				const key = `${subtest.config.parallelProcesses}.${subtest.config.concurrency}.${subtest.config.totalRequestsToSend}.${subtest.config.route}`
				const newTrials: any = {};
				for (let i = 0; i < subtest.trials.length; i += 1) {
					newTrials[i] = subtest.trials[i];
				}
				newSubtests[key] = newTrials;
			});
			newTests[test.name] = newSubtests;
		});
		report.tests = newTests;
	});
	fs.writeFileSync('/out/out-raw.csv', parse(csvData, opts), { encoding: 'utf-8' });
}

// Loads relavent information form postgres and drops the data out into json, csv formats
export default async function writeReports(): Promise<void> {
	
}
