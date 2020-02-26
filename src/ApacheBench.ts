import { execSync } from 'child_process';

export interface ApacheData {
	rps: number;
}

export default function testLoad(host: string, port: number, path: string, concurrency: number, numberOfCalls: number): ApacheData | null {
	try {
		const loadResult: string = String(execSync(`ab -c ${concurrency} -n ${numberOfCalls} ${host}:${port}${path}`));
		return {
			rps: 0,
		}
	} catch (error) {
		console.log('Error performing load test');
		console.error(error);
		return null;
	}
}