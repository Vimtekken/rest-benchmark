import OS from 'os';
import { spawnSync } from 'child_process';

export interface HeyData {
	requestsPerSecond: number;
}

function extractRequestsPerSecond(data: string): number {
	const findRegex = new RegExp(/Requests\/sec:\s*([\d.]+)/gui);
	const matches = [...data.matchAll(findRegex)];
	if (matches?.length) {
		const match = matches[0];
		// console.log('Match', match);
		const numString = match[1]; // Get first group. Index 0 is full match.
		// console.log('Num string', numString);
		return Number(numString);
	}
	return 0;
}

function extractData(data: string): HeyData {
	// @todo Extract more data
	return {
		requestsPerSecond: extractRequestsPerSecond(data),
	};
}

const cpus = OS.cpus().length;
const defaultThreads = 0.5 * cpus;

export default function testLoad(
	host: string,
	port: number,
	path: string,
	concurrency: number,
	numberOfCalls: number,
	keepAlive: boolean = false,
): HeyData {
	const threads = concurrency < defaultThreads ? concurrency : defaultThreads;
	// const keepAliveParam = keepAlive ? ' ' : ' -disable-keepalive ';
	const image = 'ricoli/hey';
	const result = spawnSync(`docker run ${image} -n ${numberOfCalls} -t 1 -c ${concurrency} -cpus ${threads} http://${host}:${port}${path}`, { stdio: 'pipe', shell: true });
	const stringResult = (result.output[1] as unknown as Buffer).toString('utf-8');
	console.log('Test result', stringResult);
	if (result.error) {
		console.error(result.error);
	}
	const extractedData = extractData(stringResult);
	console.log('Extracted', extractedData);
	return extractedData;
}
