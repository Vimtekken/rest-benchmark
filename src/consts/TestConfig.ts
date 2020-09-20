import { TestConfig } from '../interfaces/Tests';

// @todo Add a class of tests for larger responses. Like 1k, 32k, 128k, 512k, 1m, 8m response sizes.
// @todo Add a class of tests for heavier computation routes. Maybe fibbonacci number calculation to simulate computation occurring in route.
// @todo Bring back keep-alive false tests.
// @todo Implement CPU variance tests.
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
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 8,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 16,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 32,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 96,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 128,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 160,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
			],
		},
		// @todo Implement docker controls for starting/stopping the images with difference resource allocations for cpu controls.
		// {
		// 	name: 'CPU scaling',
		// 	subtests: [
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.125,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.25,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.375,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.50,
		// 		},
		// 	],
		// },
		// Disabling keep alive for now. Not all servers respect closing all the time.
		// So for test at the moment they are all keep alive.
		// @todo Re-enable these tests
		// {
		// 	name: 'keep alive',
		// 	subtests: [
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 32,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.25,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 32,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: true,
		// 			cpuAllocationPercent: 0.25,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: false,
		// 			cpuAllocationPercent: 0.25,
		// 		},
		// 		{
		// 			parallelProcesses: 1,
		// 			concurrency: 64,
		// 			totalRequestsToSend: 10000,
		// 			route: '/healthcheck',
		// 			keepAlive: true,
		// 			cpuAllocationPercent: 0.25,
		// 		},
		// 	],
		// },
		{
			name: 'total requests',
			subtests: [
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 1000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 5000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 10000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 25000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
				{
					parallelProcesses: 1,
					concurrency: 64,
					totalRequestsToSend: 50000,
					route: '/healthcheck',
					keepAlive: true,
					cpuAllocationPercent: 0.25,
				},
			],
		},
	],
};

export default config;
