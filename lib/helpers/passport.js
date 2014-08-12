'use strict';

var database = {};

exports.init = function(db) {
    database = db;
}

exports.login = function(username, password, done) {
    database.findUser(username, function(err, user) {
        if (err) { return done(err) }
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        if (!user.verified()) {
            return done(null, false, { message: 'Account not verified. Please check your email.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    });
}

exports.serialize = function(user, done) {
    done(null, user.id);
}

exports.deserialize = function(id, done) {
    database.findUserId(id, function(err, user) {
        done(null, user);
    });
}
