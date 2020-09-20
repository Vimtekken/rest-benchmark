import { Client } from '@elastic/elasticsearch';
import Environment from '../consts/Environment';
import { execSync } from 'child_process';
import Logger from '../Logger';
import Utility from '../Utility';

const log = new Logger('rb', 'elasticsearch');
const enabled = true;

export default class ElasticSearch {
	protected static conn: Client | undefined;

	static get connection(): Client | undefined {
		if (!enabled) {
			return undefined;
		}
		if (!this.conn) {
			const connectionUrl = `http://${Environment.REMOTE_HOST}:9200`;
			log.debug('Creating connection to', connectionUrl);
			this.conn = new Client({ node: connectionUrl });
		}
		return this.conn;
	}

	static start(): void {
		if (enabled) {
			execSync(`docker-compose -f ${__dirname}/docker-compose.yml up --build -d`, { stdio: 'pipe' });
		}
	}

	static stop(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml down`, { stdio: 'ignore' });
	}

	static async waitForHealth(): Promise<void> {
		log.debug('Starting wait for health');
		let healthy = false;
		while (!healthy) {
			await Utility.sleep(20);
			try {
				if (this.connection) {
					const response = await this.connection.cluster.health({ wait_for_status: 'green' });
					log.debug(response);
					healthy = true;
				}
			} catch (error) {
				// Do nothing really
			}
		}
		log.debug('Finished wait for health');
	}
}
