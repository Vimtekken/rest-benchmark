import { execSync } from 'child_process';

export default class Monitoring {
	static start(): void {
		execSync(`docker pull influxdb:1.7 && docker run -d --name rest-benchmark-influx -p 8086:8086 influxdb:1.7`);
		execSync(`docker pull telegraf:latest && docker run -d --name rest-benchmark-telegraf telegraf:latest`);
	}

	static stop(): void {
		execSync(`docker stop rest-benchmark-influx && docker rm rest-benchmark-influx`);
		execSync(`docker stop rest-benchmark-telegraf && docker rm rest-benchmark-telegraf`);
	}
}