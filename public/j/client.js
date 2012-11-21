"use strict";

window.addEventListener('load', function() {
	var url, socket, messages = [], init, painter;

	url = location.origin;
	socket = io.connect(url, { reconnect: false });

	socket.on('init', function (color) {
		painter = init(messages, color);

		socket.on('paint', function (data) {
			painter.paint(data);
		});

		(function sendData() {
			if (messages.length) {
				painter.paintLocal();
				socket.emit('paint', messages);
				messages.length = 0;
			}
			setTimeout(sendData, 20);
		})();
	});


	init = function (messages, color) {
		var canvas, context, isPainting;

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');

		canvas.addEventListener('mousemove', function (e) {
			if (isPainting) {
				messages.push({
					x: e.clientX - e.currentTarget.offsetLeft,
					y: e.clientY - e.currentTarget.offsetTop
				});
			}
		});
		canvas.addEventListener('mousedown', function (e) {
			isPainting = true;
		});
		canvas.addEventListener('mouseup', function (e) {
			isPainting = false;
		});

		return {
			paint: function (response) {
				context.beginPath();
				context.fillStyle = response.color;
				response.data.forEach(function (obj) {
					context.arc(obj.x, obj.y, 3, 0, 2 * Math.PI, false);
				});
				context.fill();
			},
			paintLocal: function () {
				this.paint({ data: messages, color: color });
			}
		};
	};
});
