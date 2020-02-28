import Express from 'express';

// Init express
const app = Express();

// Add routes
app.get('/healthcheck', async (request: Express.Request, response: Express.Response) => {
	response.send();
});

console.log('Application listening on 8080');
app.listen(8080);
