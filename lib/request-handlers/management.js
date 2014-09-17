'use strict';

//var database = require('../repositories/database');

exports.user = function(req, res) {
    res.render('profile/account', { title: 'AniDex', user: req.user, message: req.session.message, error: req.session.error });
    req.session.message = null;
    req.session.error = null;
    res.send(204);
};

exports.group = function(req, res) {
    //var group = req.param('id');
    res.send(204);
};
