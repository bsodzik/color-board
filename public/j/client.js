"use strict";

window.addEventListener('load', function() {
	var url, socket, messages = [], init, painter;

	url = location.origin;
	socket = io.connect(url, { reconnect: false });

	socket.on('init', function (color) {
		painter = painterFactory(messages);

		socket.on('paint', function (data) {
			painter.paint(data);
		});

		(function sendData() {
			if (messages.length) {
				socket.emit('paint', messages);
				messages.length = 0;
			}
			setTimeout(sendData, 20);
		})();
	});
});
