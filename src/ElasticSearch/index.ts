import { Client } from '@elastic/elasticsearch';
import Environment from '../consts/Environment';
import { execSync } from 'child_process';
import Logger from '../Logger';

const log = new Logger('rb', 'elasticsearch');
const enabled = false;

export default class ElasticSearch {
	protected static conn: Client | undefined;

	static get connection(): Client | undefined {
		if (!enabled) {
			return undefined;
		}
		if (!this.conn) {
			const connectionUrl = `http://${Environment.REMOTE_HOST}:9200`;
			log.info('Creating connection to', connectionUrl)
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
}
