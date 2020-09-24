import ApplicationConfig from '../interfaces/ApplicationConfig';

// @todo Investigate thread per core dart server?
// @todo Java?
// @todo lithium?
// @todo Elixir / erlang
// @todo Obj-c?
// @todo look into https://github.com/virtuozzo/httpress instead of apache-bench
const config: ApplicationConfig[] = [
	{
		name: 'cpp-drogon',
		source: 'servers/cpp/drogon',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'cpp-lithium',
		source: 'servers/cpp/lithium',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'cpp-pistache.io',
		source: 'servers/cpp/pistache.io',
		httpPort: 8080,
		https: false,
	},
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
		name: 'dart-raw-isolate',
		source: 'servers/dart/raw-native-isolate',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'dart-shelf',
		source: 'servers/dart/shelf',
		httpPort: 8080,
		https: false,
	},
	{
		name: 'typescript-deno',
		source: 'servers/typescript/deno',
		httpPort: 8000,
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
	{
		name: 'rust-rocket',
		source: 'servers/rust/rocket',
		httpPort: 8000,
		https: false,
	},
];

export default config;
