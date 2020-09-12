
interface ApplicationConfig {
	httpPort: number;
	https: boolean;
	name: string;
	source: string;
}

const config: ApplicationConfig[] = [
	{
		name: 'python-flask',
		source: 'servers/python/flask',
		httpPort: 5000,
		https: false,
	},
	{
		name: 'dart-raw',
		source: 'servers/dart/raw',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'node-express',
		source: 'servers/nodejs/express',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'node-express-cluster',
		source: 'servers/nodejs/express-cluster',
		httpPort: 8080,
		https: false,
	},
];

export default config;
