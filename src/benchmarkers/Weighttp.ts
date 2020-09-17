import OS from 'os';
import { spawnSync } from 'child_process';

export interface WeighttpData {
	requestsPerSecond: number;
}

function extractFinishedSection(result: string): string {
	const regex = new RegExp(/finished(?:\s|.)*$/gui);
	const matches = result.match(regex);
	return matches?.length ? matches[0] : '';
}

function extractRequestsPerSecond(data: string): number {
	const findRegex = new RegExp(/\d+ req\/s/gui);
	const matches = data.match(findRegex);
	if (matches?.length) {
		const value = matches[0];
		const numString = value.replace(/[^\d]*/gui, '');
		return Number(numString);
	}
	return 0;
}

function extractData(result: string): WeighttpData {
	// @todo Extract more data
	const finishedSection = extractFinishedSection(result);
	return {
		requestsPerSecond: extractRequestsPerSecond(finishedSection),
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
): WeighttpData {
	const threads = concurrency < defaultThreads ? concurrency : defaultThreads;
	const keepAliveParam = keepAlive ? ' -k ' : ' ';
	const image = 'mengskysama/weighttp';
	const result = spawnSync(`docker run ${image} -n ${numberOfCalls} -c ${concurrency} -t ${threads}${keepAliveParam}${host}:${port}${path}`, { stdio: 'pipe', shell: true });
	const stringResult = (result.output[1] as unknown as Buffer).toString('utf-8');
	// console.log('Test result', stringResult);
	if (result.error) {
		console.error(result.error);
	}
	return extractData(stringResult);
}
