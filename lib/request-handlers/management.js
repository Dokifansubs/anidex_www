'use strict';

var database = {};

exports.init = function(db) {
    database = db;
}

exports.user = function(req, res) {
    res.render('account', { title: 'AniDex', user: req.user});
}

exports.group = function(req, res) {
    var group = req.param('id');
}