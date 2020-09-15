import { execSync } from 'child_process';

export default class Monitoring {
	static start(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml up --build -d`, { stdio: 'pipe' });
	}

	static stop(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml down`, { stdio: 'ignore' });
	}
}