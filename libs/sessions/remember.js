'use strict';

var utils	= require(APPROOT + '/libs/helpers/utils');

exports.consumeToken = function(token, done) {
	var uid = REDIS.get(token);
	REDIS.del(token);
	return done(null, uid);
};

exports.issueToken = function(user, done) {
	var token = utils.randomString(64);
	saveToken(token, user.id, function(err) {
		if (err) { return done(err); }
		return done(null, token);
	});
};

var saveToken = function(token, user, done) {
	REDIS.set(token, user.id);
	return done();
};