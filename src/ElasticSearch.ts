import { Client } from '@elastic/elasticsearch';
import Environment from './consts/Environment';
import Logger from './Logger';

const log = new Logger('rb', 'elasticsearch');

export default class ElasticSearch {
	protected static conn: Client | undefined;

	static get connection(): Client {
		if (!this.conn) {
			const connectionUrl = `http://${Environment.REMOTE_HOST}:9200`;
			log.info('Creating connection to', connectionUrl)
			this.conn = new Client({ node: connectionUrl });
		}
		return this.conn;
	}
}
