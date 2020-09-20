import { execSync } from 'child_process';
import Logger from '../Logger';

const log = new Logger('rb', 'kibana');

export default class Kibana {
	static start(remoteHost: string): void {
		// execSync(`docker-compose -f ${__dirname}/docker-compose.yml up --build -d`, { stdio: 'pipe' });
		execSync(`docker run -d -p 5601:5601 --env ELASTICSEARCH_HOSTS=http://${remoteHost}:9200 --name rest-benchmark-kibana docker.elastic.co/kibana/kibana:7.9.1`);
	}

	static stop(): void {
		// execSync(`docker-compose -f ${__dirname}/docker-compose.yml down`, { stdio: 'ignore' });
		try {
			execSync('docker rm -f rest-benchmark-kibana');
		} catch (error) {
			// Container probably didn't exist
			log.debug(error);
		}
	}
}
