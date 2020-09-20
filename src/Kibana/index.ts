import { execSync } from 'child_process';
import { promises as FS } from 'fs';
import Logger from '../Logger';
import NodeFetch from 'node-fetch';
import Utility from '../Utility';

const log = new Logger('rb', 'kibana');

export default class Kibana {
	static async pushDashboards(remoteHost: string): Promise<void> {
		let succeeded = false;
		while (!succeeded) {
			try {
				await Utility.sleep(1000); // It takes a while. 1 second intervals is fine.
				const overview = (await FS.readFile(`${__dirname}/dashboards/overview.json`)).toString('utf-8');
				const response = await NodeFetch(`http://${remoteHost}:5601/api/kibana/dashboards/import`, {
					method: 'post',
					body: overview,
					headers: { 'Content-Type': 'application/json' },
				});
				if (!response.ok) {
					log.error(await response.text());
				}
				succeeded = response.ok;
			} catch (error) {
				log.debug(error);
			}
		}
	}

	static start(remoteHost: string): void {
		// This does disable xsrf for kibana, but this is all local so who cares. It's no production system.
		// We do this to allow us to push the dashboards without doing extra auth crap.
		execSync(`docker run -d -p 5601:5601 --env ELASTICSEARCH_HOSTS=http://${remoteHost}:9200 --env SERVER_XSRF_DISABLEPROTECTION=true --name rest-benchmark-kibana docker.elastic.co/kibana/kibana:7.9.1`);
	}

	static stop(): void {
		try {
			execSync('docker rm -f rest-benchmark-kibana');
		} catch (error) {
			// Container probably didn't exist
			log.debug(error);
		}
	}
}
