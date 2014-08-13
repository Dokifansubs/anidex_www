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
        user.validPassword(password, function(valid) {
            if (valid) {
                if (!user.verified()) {
                    return done(null, false, { message: 'Account not verified. Please check your email.' });
                }
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect username or password.' });
        });
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