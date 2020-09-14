import Environment from '../consts/Environment';
import { execSync } from 'child_process';
import Knex from 'knex';
import Logger from '../Logger';
import PostgresConsts from '../consts/Postgres';
import Utility from '../Utility';

const log = new Logger('rb', 'postgres');
const waitInterval = 25;

export default class Postgres {
	protected static knex: Knex | undefined;

	static async awaitHealthy(): Promise<number> {
		const start = Date.now();
		let healthy = false;
		while (!healthy) {
			await Utility.sleep(waitInterval);
			try {
				const result = await this.connection.raw('SELECT 1 AS healthy;');
				healthy = result.rows?.length && result.rows[0].healthy === 1;
			} catch (error) {
				log.debug(error);
				// Not booted yet.
			}
		}
		return Date.now() - start;
	}

	static async clear(): Promise<void> {
		await Promise.all(PostgresConsts.tables.map((table) => this.connection.raw(`DELETE FROM ${table}`)));
	}

	static get connection(): Knex {
		if (this.knex === undefined) {
			const connection = `postgres://postgres:foobar@${Environment.REMOTE_HOST}:45432/bench`;
			log.debug('No connection found, making new connection to', connection);
			this.knex = Knex({
				client: 'pg',
				connection,
				searchPath: 'public',
				pool: {
					min: 5,
					max: 50,
				},
			});
		}
		return this.knex;
	}

	static build(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml build`, { stdio: 'pipe' });
	}

	static start(): void {
		Postgres.build();
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml up -d`, { stdio: 'pipe' });
	}

	static stop(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml down`, { stdio: 'ignore' });
	}
}
