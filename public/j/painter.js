"use strict";

var painterFactory = (function () {

	return function (messages) {
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
			}
		};
	};

})();
