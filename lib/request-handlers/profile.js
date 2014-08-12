'use strict';

exports.register = function(req, res) {
    res.render('register', {title: 'AniDex', user: req.user});
}

exports.login = function(req, res) {
    var errmsg = req.flash().error;
    if (errmsg !== undefined) {
        res.render('login', {title: 'AniDex', user: req.user, error: errmsg });
    } else {
        res.render('login', {title: 'AniDex', user: req.user});
    }
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}
