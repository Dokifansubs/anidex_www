var database	= require('../repositories/database');
var redis		= require('redis');

var client		= redis.createClient();

exports.save = function(token, user, done) {
	client.set(token, user.userId);
	done(null);
};

exports.consume = function(token, done) {
	client.get(token, function(err, reply) {
		if (err) { return done(err, null); }
		database.findUserId(reply.toString(), function(err, user) {
			if (err) { return done(err, null); }
			client.del(token, function(err) {});
			done(null, user);
		});
	});
	
};