import { TestConfig } from './interfaces/Tests';

const config: TestConfig = {
	numberOfTrails: 3,
	tests: [
		{
			name: 'concurrency',
			subtests: [
				{
					parallelProcesses: 1,
					concurrency: 1,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
				},
				{
					parallelProcesses: 1,
					concurrency: 8,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
				},
				{
					parallelProcesses: 1,
					concurrency: 32,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
				},
				{
					parallelProcesses: 1,
					concurrency: 128,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
				},
				// {
				// 	parallelProcesses: 2,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 15000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 4,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 20000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 8,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 30000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 12,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 40000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 12,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 40000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 18,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 50000,
				// 	route: '/healthcheck',
				// },
				// {
				// 	parallelProcesses: 24,
				// 	concurrency: 128,
				// 	totalRequestsToSend: 50000,
				// 	route: '/healthcheck',
				// },
			],
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
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 5000,
					route: '/healthcheck',
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 50000,
					route: '/healthcheck',
				},
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
			],
		},
	],
};

export default config;
