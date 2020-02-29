import fs from 'fs';
import { parse } from 'json2csv';

import { ApplicationReport } from './interfaces/ServerReport';

export default function (reports: ApplicationReport[]) {
	// Write json out
	fs.writeFileSync('/out/out-raw.json', JSON.stringify(reports), { encoding: 'utf-8' });

	// Write CSV
	// const fields = ['field1', 'field2', 'field3'];
	const opts = {
		flatten: true,
	};
	const csvData = reports as any[];
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
	const csv = parse(csvData, opts);
	fs.writeFileSync('/out/out-raw.csv', csv, { encoding: 'utf-8' });
}