
interface ApplicationConfig {
	httpPort: number;
	https: boolean;
	name: string;
	source: string;
}

const config: ApplicationConfig[] = [
	{
		name: 'node-express',
		source: 'servers/nodejs/express',
		httpPort: 8080,
		https: false,
	}
]

export default config;
