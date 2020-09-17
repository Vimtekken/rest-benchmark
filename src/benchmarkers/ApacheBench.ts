import {
	ApacheData,
	ConnectTimeData,
	ConnectTimes,
	DataTransfers,
	RequestData,
} from '../interfaces/Apache';
import { exec } from 'child_process';
import Logger from '../Logger';

const log = new Logger('rb', 'ApacheBench');

const connectionRegexes = {
	connect: /Connect:\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)/gi, // number per group
	processing: /Processing:\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)/gi, // number per group
	waiting: /Waiting:\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)/gi, // number per group
	total: /Total:\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)\s*([\d.]*)/gi, // number per group
};
const dataRegexes = {
	totalTransferred: /Total transferred:\s*([\d.]* .*\b)/gi, // string
	transferRate: /Transfer rate:\s*([\d.]* .*\b)/gi, // string
};
const requestRegexes = {
	completeRequsts: /Complete requests:\s*([\d.]*)/gi, // number
	failedRequsts: /Failed requests:\s*([\d.]*)/gi, // number
	non2xx: /Non-2xx responses:\s*([\d.]*)/gi, // number
	rps: /Requests per second:\s*([\d.]*)/gi, // number
	timePerRequest: /Time per request:\s*([\d.]* .*\b)/gi, // string, more than one match. First is mean. Use that.
	duration: /Time taken for tests:\s*([\d.]*)/gi, // number
};

function extractGroup1Number(abLog: string, regex: RegExp): number {
	const matches: RegExpExecArray | null = regex.exec(abLog);
	if (!matches || matches.length <= 1) {
		return 0;
	}
	return parseInt(matches[1], 10);
}

function extractGroup1String(abLog: string, regex: RegExp): string {
	const matches: RegExpExecArray | null = regex.exec(abLog);
	if (!matches || matches.length <= 1) {
		return '';
	}
	return matches[1];
}

// Connect
function extractConnectData(abLog: string, regex: RegExp): ConnectTimeData {
	const matches: RegExpExecArray | null = regex.exec(abLog);
	if (!matches) {
		return {
			min: 0,
			mean: 0,
			sd: 0,
			median: 0,
			max: 0,
		};
	}
	return {
		min: matches.length > 1 && matches[1] ? parseInt(matches[1], 10) : 0,
		mean: matches.length > 2 && matches[2] ? parseInt(matches[2], 10) : 0,
		sd: matches.length > 3 && matches[3] ? parseInt(matches[3], 10) : 0,
		median: matches.length > 4 && matches[4] ? parseInt(matches[4], 10) : 0,
		max: matches.length > 5 && matches[5] ? parseInt(matches[5], 10) : 0,
	};
}

function extractConnectTimes(abLog: string): ConnectTimes {
	return {
		connect: extractConnectData(abLog, new RegExp(connectionRegexes.connect)),
		processing: extractConnectData(abLog, new RegExp(connectionRegexes.processing)),
		waiting: extractConnectData(abLog, new RegExp(connectionRegexes.waiting)),
		total: extractConnectData(abLog, new RegExp(connectionRegexes.total)),
	};
}

// Data
function extractDataTransfers(abLog: string): DataTransfers {
	return {
		totalTransferred: extractGroup1String(abLog, new RegExp(dataRegexes.totalTransferred)),
		transferRate: extractGroup1String(abLog, new RegExp(dataRegexes.transferRate)),
	};
}

// Requests
function extractRequests(abLog: string): RequestData {
	return {
		completed: extractGroup1Number(abLog, new RegExp(requestRegexes.completeRequsts)),
		duration: extractGroup1Number(abLog, new RegExp(requestRegexes.duration)),
		failed: extractGroup1Number(abLog, new RegExp(requestRegexes.failedRequsts)),
		non2xx: extractGroup1Number(abLog, new RegExp(requestRegexes.non2xx)),
		rps: extractGroup1Number(abLog, new RegExp(requestRegexes.rps)),
		timePerRequest: extractGroup1Number(abLog, new RegExp(requestRegexes.timePerRequest)),
	};
}

export default async function testLoad(
	host: string,
	port: number,
	path: string,
	concurrency: number,
	numberOfCalls: number,
	keepAlive: boolean = false,
): Promise<ApacheData | null> {
	return new Promise<ApacheData | null>((resolve) => {
		// -k option to allow keep-alive
		exec(`ab -c ${concurrency} -n ${numberOfCalls}${keepAlive ? ' -k ' : ' '}${host}:${port}${path}`, {}, (error, stdout) => {
			if (error) {
				log.error('Error performing load test', error);
				resolve(null);
			}
			const loadResult = String(stdout);
			resolve({
				connect: extractConnectTimes(loadResult),
				data: extractDataTransfers(loadResult),
				requests: extractRequests(loadResult),
			});
		});
	});
}
