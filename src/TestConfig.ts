import { TestConfig } from './interfaces/Tests';

const config: TestConfig = {
	numberOfTrails: 1,
	tests: [
		{
			name: 'concurrency',
			subtests: [
				{
					parallelProcesses: 1,
					concurrency: 1,
					totalRequestsToSend: 1000,
					route: '/healthcheck',
				},
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 8,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 32,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 256,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 512,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 1024,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
			]
		},
		{
			name: 'total requests',
			subtests: [
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 1000,
					route: '/healthcheck',
				},
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 5000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 10000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 50000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 100000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 500000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 1,
				// 	concurrency: 64,
				// 	totalRequestsToSend: 1000000,
				// 	route: '/healthcheck',
				// },
			]
		}
	]
}

export default config;