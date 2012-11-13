// Including libraries

// var app = require('http').createServer(handler);

var express = require ('express');
var app = express.createServer(handler);

//for express 3
//var app = express();




//for express 3 
//var app = express();
var
	io = require('socket.io').listen(app),
	static = require('node-static'); // for serving files

// for long polling support on heroku
// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
	
// This will make all the files in the current folder
// accessible from the web

var fileServer = new static.Server('./');

// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
// app.listen(8080);
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


/*
app.get('/', function(request, response) {
  response.send('Hello World!');
});
*/

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	request.addListener('end', function () {
        fileServer.serve(request, response); // this will return the correct file
    });
}

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {

		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
});