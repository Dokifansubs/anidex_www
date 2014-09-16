'use strict';

var database = require('../repositories/database');

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

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/login');
}