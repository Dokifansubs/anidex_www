'use strict';

//var database = require('../repositories/database');

exports.user = function(req, res) {
    res.render('profile/account', { title: 'AniDex', user: req.user, message: req.flash('info'), error: req.flash('error') });    
};

exports.group = function(req, res) {
    //var group = req.param('id');
    res.send(204);
};
