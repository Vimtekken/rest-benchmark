import Environment from '../consts/Environment';
import { execSync } from 'child_process';
import Knex from 'knex';
import PostgresConsts from '../consts/Postgres';
import Utility from '../Utility';

const waitInterval = 25;

export default class Postgres {
	protected static knex: Knex | undefined;

	static async awaitHealthy(): Promise<number> {
		const start = Date.now();
		let healthy = false;
		while (!healthy) {
			await Utility.sleep(waitInterval);
			const result = await this.connection.raw('SELECT 1 AS healthy;');
			healthy = result.rows?.length && result.rows[0].healthy === 1;
		}
		return Date.now() - start;
	}

	static async clear(): Promise<void> {
		await Promise.all(PostgresConsts.tables.map((table) => this.connection.raw(`DELETE FROM ${table}`)));
	}

	static get connection(): Knex {
		if (!this.knex) {
			this.knex = Knex({
				client: 'pg',
				connection: `${Environment.REMOTE_HOST}:45432`,
				searchPath: 'public',
				pool: {
					min: 5,
					max: 50,
				},
			});
		}
		return this.knex;
	}

	static start(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml up --build -d`, { stdio: 'ignore' });
	}

	static stop(): void {
		execSync(`docker-compose -f ${__dirname}/docker-compose.yml down`, { stdio: 'ignore' });
	}
}
