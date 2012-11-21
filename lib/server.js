'use strict';

var http        = require('http')
  , socketIo    = require('socket.io')
  , colors      = require('./colors')
  , httpHandler = require('./httpHandler')
  , httpServer, ioServer;

httpServer = http.createServer(httpHandler);
ioServer = socketIo.listen(httpServer, {
	transports: ['websocket'], 'log level': 1
});

httpServer.listen(8080, function () {
	console.log('Server is up and running on port 8080');
});

ioServer.sockets.on('connection', function (socket) {
	var color = colors[ioServer.sockets.clients().length % colors.length];

	socket.emit('init', color);

	socket.on('paint', function (data) {
		//socket.broadcast.emit('paint', {
		ioServer.sockets.emit('paint', {
			data: data,
			color: color
		});
	});
});
