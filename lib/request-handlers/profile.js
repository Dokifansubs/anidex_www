'use strict';

var validator = require('validator');
var request = require('request');

var EM = require('./../repositories/email');
var database = require('../repositories/database');
var CaptchaConf = require('./../../conf/server.json').captcha;

exports.register = function(req, res) {
    if (req.user) {
        // in case someone manually types /register address.
        return res.redirect('/');
    }    
    res.render('profile/register', {title: 'AniDex', user: req.user, message: req.flash(), public_key: CaptchaConf.public_key});    
};

exports.login = function (req, res) {    
    res.render('profile/login', { title: 'AniDex', user: req.user, message: req.flash() });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.forgotPassword = function (req, res) {
    if (req.user) { return res.redirect('/'); }
    res.render('profile/forgot-password', { title: 'AniDex', user: req.user, message: req.flash()});
};

exports.recoverPassword = function (req, res) {
    if (req.user) { return res.redirect('/'); }
    var hash = req.param('h');
    res.render('profile/recover-password', { title: 'AniDex', user: req.user, message: req.flash(), hash: hash });
};

exports.updateRecoverPassword = function (req, res) {
    if (req.user) { return res.redirect('/'); }    
    var hash = req.param('hash');
    var npass = req.param('npass');
    var cpass = req.param('cpass');
    
    if (npass !== cpass) {
        req.flash('error', 'passwords do not match');
        return res.redirect('/recover-password?h=' + hash);
    }
    
    database.updateRecoverPassword(hash, npass, function (err) {        
        if (err) {
            req.flash('error', 'Failure to set password.');
            return res.redirect('/recover-password?h=' + hash);
        }
        req.flash('info', 'New password set!');
        return res.redirect('/recover-password?h=' + hash);
    });
};

exports.setRecoverPassword = function (req, res) {
    if (req.user) { return res.redirect('/'); }
    var identifier = req.param('identifier');

    database.findUserOrEmail(identifier, function (err, user) {
        if (err) {
            req.flash('error', 'Database error, please try again later');
            return res.redirect('/forgot-password');
        }
        if (!user) {
            req.flash('error', 'User or Email not found.');
            return res.redirect('/forgot-password');
        }
        database.recoverPassword(user, function (err) {
            req.flash('info', 'An email has been sent to your email with instructions.');
            EM.dispatchRecoverPassword(user, function () {
                //console.log(err || message);
            });
            return res.redirect('/forgot-password');
        });
    });
};

exports.registerForm = function(req, res) {
    var username = req.param('username');
    var email = req.param('email');
    var password = req.param('password');
    var cpassword = req.param('cpassword');
    var challenge = req.param('recaptcha_challenge_field');
    var answer = req.param('recaptcha_response_field');

    if (password !== cpassword) {
        req.flash('error', 'passwords not same');
        return res.redirect('/register');
    }

    if (!validator.isEmail(email)) {
        req.flash('error', 'Invalid email');
        return res.redirect('/register');
    }



    database.findUser(username, function(err, user) {
        if (err) {
            req.flash('error', 'Database error, please try again later.');
            return res.redirect('/register');
        }
        if (user) {
            req.flash('error', 'Username already exists.');
            return res.redirect('/register');
        }
        database.emailExists(email, function(exists) {
            if (exists) {
                req.flash('error', 'Email already used.');
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
                    req.flash('error', 'Error with captcha system.');
                    return res.redirect('/register');
                }
                if (success !== 'true') {
                    req.flash('error', 'Incorrect captcha.');
                    return res.redirect('/register');
                }

                database.createUser(username, password, email, function(err, user_id) {
                    database.findUserId(user_id, function(err, user) {
                        req.flash('info', 'An email has been sent to ' + user.email + ' to verify your account.');
                        EM.dispatchVerifyAccount(user, function() {
                            //console.log(err || message);
                        });
                        return res.redirect('/register');
                    });
                });
            });
        });
    });
};

exports.verify = function(req, res) {
    var hash = req.param('h');

    database.verifyUser(hash, function(err, status) {
        if (err) {
            return res.render('profile/verify-account', { title: 'AniDex', error: 'Database error.'});
        }
        switch (status) {
            case 2:
                return res.render('profile/verify-account', { title: 'AniDex', error: 'Account not found' });
            case 0:
                return res.render('profile/verify-account', { title: 'AniDex', message: 'Account verified.' });
            default:
                return res.render('profile/verify-account', { title: 'AniDex', error: 'Unknown error.'});
        }
    });
};

exports.updatePassword = function (req, res) {
    var opass = req.param('opass');
    var npass = req.param('npass');
    var cpass = req.param('cpass');
    var user = req.user;
    
    user.validPassword(opass, function (okay) {
        if (!okay) {
            req.flash('error' = 'Old password is incorrect.');
            return res.redirect('/account');
        }
        if (npass !== cpass) {
            req.flash('error' = 'Passwords do not match.');
            return res.redirect('/account');
        }
        database.updatePassword(user.id, npass, function (err) {
            if (err) {
                req.flash('error', 'Database error, please try again later.');
                return res.redirect('/account');
            }
            req.flash('info', 'Password successfully updated.');
            return res.redirect('/account');
        });
    });
};
