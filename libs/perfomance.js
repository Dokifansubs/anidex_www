'use strict';

exports.benchmark = function(req, res, next) {
	if (res.__isRenderWrapped) {
		return next();
	}

	res.__isRenderWrapped = true;
	var original = res.render;

	res.render = function(file, data) {
		var now = new Date();
		data.time_processing = (now - req.time_start);
		original.apply(res, [file, data]);
	};

	req.time_start = new Date();
	next();
};
