import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import config from './config';
import * as fs from 'fs';

type Callback = (httpStatusCode: number, payload?: Object) => void;
interface Callbacks {
	[key: string]: (data: any, callback: Callback) => void;
}

//Instanciate the HTTP Server

const httpServer = http.createServer((req, res) => {
	unifiedServer(req, res);
});

//Start the HTTP SERVER
httpServer.listen(config.httpPort, () =>
	console.log(`Server running on port ${config.httpPort} in ${config.envName} mode`)
);

//Intanciate the HTTPS server
const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServer(req, res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, () =>
	console.log(`Server running on port ${config.httpsPort} in ${config.envName} mode`)
);

//All the server logic for both the https server and the http server
const unifiedServer = (req: http.IncomingMessage, res: http.ServerResponse) => {
	//Get the url and parse it
	const parsedUrl = url.parse(req.url!, true);

	//Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path!.replace(/^\/+|\/+$/g, '');

	//Get the query string as an object
	const queryStringObject = parsedUrl.query;

	//Get HTTP method
	const method = req.method!.toLowerCase();

	//Get the headers as an object
	const headers = req.headers;

	//Get the payload if there's any
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data: Buffer) => {
		buffer += decoder.write(data);
	});

	req.on('end', () => {
		buffer += decoder.end();
		//the handler this request should go to if one is not found use the notFound handler
		const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		//construct the data object to send to the handler
		const data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: buffer
		};
		//route the request to the handler specified in the router
		chosenHandler(data, (statusCode, payload) => {
			//use the status code called back by the handler, or default to 200
			statusCode = typeof statusCode === 'number' ? statusCode : 200;

			//use the payload called back by the handler, or default to an empty object
			payload = typeof payload === 'object' ? payload : {};

			//convert the payload to a string
			const payloadString = JSON.stringify(payload);

			res.setHeader('Content-type', 'application/json');
			res.writeHead(statusCode);
			//Send the response
			res.end(payloadString);

			//Log the request path
			console.log(data);
		});
	});
};

//Define handlers
const handlers: Callbacks = {};

//Define ping handler
handlers.ping = (data, callback) => {
	//callback an http status code, and a payload object
	callback(200);
};
//Define not found handler
handlers.notFound = (data, callback) => {
	callback(404);
};
//Define a request router
const router: Callbacks = {
	ping: handlers.ping
};
