'use strict';

var validator = require('validator');
var EM = require('./../repositories/email');
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
        return res.redirect('/register');
    }

    if (!validator.isEmail(email)) {
        req.session.message = 'Invalid email';
        return res.redirect('/register');
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
        database.emailExists(email, function(exists) {
            if (exists) {
                req.session.message = 'Email already used'
                return res.redirect('/register');
            }
            database.createUser(username, password, email, function(err, user_id) {
                database.findUserId(user_id, function(err, user) {
                    req.session.message = 'An email has been sent to ' + user.email + ' to verify your account.';
                    EM.dispatchVerifyAccount(user, function(err, message) {
                        console.log(err || message);
                    });
                    return res.redirect('/register');
                });
            });
        });
    });
}

exports.verify = function(req, res) {
    var email = req.param('e');
    var hashpass = req.param('p');

    database.verifyUser(email, hashpass, function(err, status) {
        if (err) {
            return res.render('verify-account', { title: 'AniDex', error: 'Something went wrong.'});
        }
        switch (status) {
            case 1: return res.render('verify-account', { title: 'AniDex', message: 'Account already verified'}); break;
            default: return res.render('verify-account', { title: 'AniDex', message: 'Account verified.'}); break;
        }
    })
}