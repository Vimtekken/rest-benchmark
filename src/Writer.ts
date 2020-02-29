import fs from 'fs';
import { parse } from 'json2csv';

import { ApplicationReport } from './interfaces/ServerReport';
import * as Tests from './interfaces/Tests';

interface ProcessedReports {
	application: string;
	rpsMax: {
		max: number;
		config: Tests.SingleTestConfig;
	};
}

function processData(reports: ApplicationReport[]): ProcessedReports[] {
	const processedReports: any[] = [];

	reports.forEach((report) => {
		let maxRps = 0;
		let config: Tests.TestSampleConfig | null = null;

		report.tests.forEach((test) => {
			test.subtests.forEach((subtest) => {
				subtest.trials.forEach((trial) => {
					if (trial.apache?.requests.rps || 0 > maxRps) {
						maxRps = trial.apache?.requests.rps || 0;
						config = subtest.config;
					}
				});
			});
		});
		processedReports.push({
			application: report.application,
			rpsMax: {
				max: maxRps,
				config,
			}
		});
	});

	return processedReports;
}

export default function (reports: ApplicationReport[]) {
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