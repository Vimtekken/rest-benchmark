import cluster from 'cluster';
import Express from 'express';
import os from 'os';

// Init express
const app = Express();

if (cluster.isMaster) {
	const cpus = os.cpus().length;
	for (let i = 0; i < cpus; i += 1) {
		cluster.fork();
	}
} else {
	// Add routes
	app.get('/healthcheck', async (request: Express.Request, response: Express.Response) => {
		response.send();
	});

	console.log('Application listening on 8080');
app.listen(8080);
}
