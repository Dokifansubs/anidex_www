'use strict';

var validator = require('validator');
var database = {};

exports.init = function(db) {
    database = db;
}

exports.register = function(req, res) {
    if (req.user) {
        // in case someone manually types /register address.
        res.redirect('/');
    }
    res.render('register', {title: 'AniDex', user: req.user, message: req.session.message});
    req.session.message = null;
}

exports.login = function(req, res) {
    res.render('login', {title: 'AniDex', user: req.user, error: req.flash().error });
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

exports.registerForm = function(req, res) {
    var username = req.param('username');
    var email = req.param('email');
    var password = req.param('password');
    var cpassword = req.param('cpassword');

    if (password !== cpassword) {
        req.session.message = 'passwords not same';
        res.redirect('/register');
    }

    if (!validator.isEmail(email)) {
        req.session.message = 'Invalid email';
        res.redirect('/register');
    }

    database.findUser(username, function(err, user) {
        if (err) {
            req.session.message = 'Database error, please try again later';
            return res.redirect('/register');
        }
        if (user) {
            req.session.message = 'Username already exists';
            return res.redirect('/register');
        }
        database.createUser(username, password, email, function(err, user_id) {
            req.session.message = 'Your user_id is: ' + user_id;
            return res.redirect('/register');
        });
    });
}