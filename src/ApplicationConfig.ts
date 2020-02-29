import { ApplicationConfig } from './interfaces/Config';

const config: ApplicationConfig[] = [
	{
		name: 'node-express',
		source: 'servers/nodejs/express',
		httpPort: 8080,
		https: false,
	}
]

export default config;
