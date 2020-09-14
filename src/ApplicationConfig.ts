export interface ApplicationConfig {
	httpPort: number;
	https: boolean;
	name: string;
	source: string;
}

// @todo Add deno
// @todo Investigate thread per core dart server?
// @todo Fix pistache problem?
// @todo Java?
// @todo lithium?
// @todo Rust/rocket?
// @todo Obj-c?
// @todo look into https://github.com/virtuozzo/httpress instead of apache-bench
const config: ApplicationConfig[] = [
	{
		name: 'cpp-drogon',
		source: 'servers/cpp/drogon',
		httpPort: 8080,
		https: false,
	},
	// For Some reason apache bench does not complete requests to pistache. Curl works.
	// {
	// 	name: 'cpp-pistache.io',
	// 	source: 'servers/cpp/pistache.io',
	// 	httpPort: 8080,
	// 	https: false,
	// },
	{
		name: 'cpp-seastar',
		source: 'servers/cpp/seastar',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'dart-raw',
		source: 'servers/dart/raw',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'dart-raw-native',
		source: 'servers/dart/raw-native',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'go-gin',
		source: 'servers/go/gin',
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
	{
		name: 'python-flask',
		source: 'servers/python/flask',
		httpPort: 5000,
		https: false,
	},
];

export default config;
