'use strict';

var validator = require('validator');
var EM = require('./../repositories/email');
var request = require('request');
var database = {};
var captcha_conf = require('./../../conf/captcha');

exports.init = function(db) {
    database = db;
}

exports.register = function(req, res) {
    if (req.user) {
        // in case someone manually types /register address.
        return res.redirect('/');
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
    var challenge = req.param('recaptcha_challenge_field');
    var answer = req.param('recaptcha_response_field');

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
            req.session.message = {
                type: 1,
                message: 'Database error, please try again later'
            };
            return res.redirect('/register');
        }
        if (user) {
            req.session.message = {
                type: 1,
                message: 'Username already exists'
            };
            return res.redirect('/register');
        }
        database.emailExists(email, function(exists) {
            if (exists) {
                req.session.message = {
                    type: 1,
                    message: 'Email already used'
                };
                return res.redirect('/register');
            }
            request.post('http://www.google.com/recaptcha/api/verify', {
                form: {
                    privatekey: captcha_conf.private_key,
                    remoteip: req.connection.remoteAddress,
                    challenge: challenge,
                    response: answer
                }
            }, function(err, response, body) {
                var success = body.split('\n')[0];
                if (err) {
                    req.session.message = {
                        type: 1,
                        message: 'Error with captcha system.'
                    };
                    return res.redirect('/register');
                }
                if (success !== 'true') {
                    req.session.message = {
                        type: 1,
                        message: 'Incorrect captcha.'
                    };
                    return res.redirect('/register');
                }

                database.createUser(username, password, email, function(err, user_id) {
                    database.findUserId(user_id, function(err, user) {
                        req.session.message = {
                            type: 0,
                            message: 'An email has been sent to ' + user.email + ' to verify your account.'
                        };
                        EM.dispatchVerifyAccount(user, function(err, message) {
                            //console.log(err || message);
                        });
                        return res.redirect('/register');
                    });
                });
            });
        });
    });
}

exports.verify = function(req, res) {
    var hash = req.param('h');

    database.verifyUser(hash, function(err, status) {
        if (err) {
            return res.render('verify-account', { title: 'AniDex', error: 'Something went wrong.'});
        }
        switch (status) {
            case 1: return res.render('verify-account', { title: 'AniDex', message: 'Account already verified'}); break;
            default: return res.render('verify-account', { title: 'AniDex', message: 'Account verified.'}); break;
        }
    })
}