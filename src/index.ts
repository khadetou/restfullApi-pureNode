import http from 'http';

//Create a server object:
const server = http.createServer((req, res) => {
	res.end('Hello World\n');
});

//Lets start our server
server.listen(3000, () => console.log('Server started at port 3000'));
