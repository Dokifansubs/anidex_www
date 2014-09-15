'use strict';

var validator = require('validator');
var EM = require('./../repositories/email');
var request = require('request');
var database = {};
var CaptchaConf = require('./../../conf/server.json').captcha;

exports.init = function(db) {
    database = db;
}

exports.register = function(req, res) {
    if (req.user) {
        // in case someone manually types /register address.
        return res.redirect('/');
    }
    res.render('profile/register', {title: 'AniDex', user: req.user, message: req.session.message, error: req.session.error, public_key: CaptchaConf.public_key});
    req.session.message = null;
    req.session.error = null;
}

exports.login = function(req, res) {
    res.render('profile/login', { title: 'AniDex', user: req.user, error: req.flash().error });    
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
        req.session.error = 'passwords not same';
        return res.redirect('/register');
    }

    if (!validator.isEmail(email)) {
        req.session.error = 'Invalid email';
        return res.redirect('/register');
    }



    database.findUser(username, function(err, user) {
        if (err) {
            req.session.error = 'Database error, please try again later.';
            return res.redirect('/register');
        }
        if (user) {
            req.session.error = 'Username already exists.';
            return res.redirect('/register');
        }
        database.emailExists(email, function(exists) {
            if (exists) {
                req.session.error = 'Email already used.';
                return res.redirect('/register');
            }
            request.post('http://www.google.com/recaptcha/api/verify', {
                form: {
                    privatekey: CaptchaConf.private_key,
                    remoteip: req.connection.remoteAddress,
                    challenge: challenge,
                    response: answer
                }
            }, function(err, response, body) {
                var success = body.split('\n')[0];
                if (err) {
                    req.session.error = 'Error with captcha system.';
                    return res.redirect('/register');
                }
                if (success !== 'true') {
                    req.session.error = 'Incorrect captcha.';
                    return res.redirect('/register');
                }

                database.createUser(username, password, email, function(err, user_id) {
                    database.findUserId(user_id, function(err, user) {
                        req.session.message = 'An email has been sent to ' + user.email + ' to verify your account.';
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
            return res.render('profile/verify-account', { title: 'AniDex', error: 'Database error.'});
        }
        switch (status) {
            case 2: return res.render('profile/verify-account', { title: 'AniDex', error: 'Account not found' }); break;
            case 0: return res.render('profile/verify-account', { title: 'AniDex', message: 'Account verified.' }); break;
            default: return res.render('profile/verify-account', { title: 'AniDex', error: 'Unknown error.'}); break;
        }
    })
}

exports.updatePassword = function (req, res) {
    var opass = req.param('opass');
    var npass = req.param('npass');
    var cpass = req.param('cpass');
    var user = req.user;
    
    user.validPassword(opass, function (okay) {
        if (!okay) {
            req.session.error = 'Old password is incorrect.';
            return res.redirect('/account');
        }
        if (npass != cpass) {
            req.session.error = 'Passwords do not match.';
            return res.redirect('/account');
        }
        database.updatePassword(user.id, npass, function (err) {
            if (err) {
                req.session.error = 'Database error, please try again later.';
                return res.redirect('/account');
            }
            req.session.message = 'Password successfully updated.';
            return res.redirect('/account');
        });
    });
}