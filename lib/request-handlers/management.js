'use strict';

var database = require('../repositories/database');
var moment = require('moment');
var pretty = require('prettysize');

var renderSettings = function (req, res, page) {
    database.getCategories(function (err, data) {
        res.render('profile/account/' + page, { title: 'AniDex', user: req.user, message: req.flash(), categories: data, page: page });
    });
}

var renderMessages = function (req, res, page) {
    // TODO: Code to render messages receive.
}

var renderTorrents = function (req, res, page) {
    database.getTorrentsByUser(req.user.id, 0, 50, function (err, data) {
        data.forEach(function (item) {
            item.created = moment(item.created);
            item.age = moment().diff(item.created, 'hours');
            if (item.age <= 0) {
                item.age = moment().diff(item.created, 'minutes') + ' min';
            } else if (item.age > 48) {
                item.age = moment().diff(item.created, 'days') + ' days';
            } else {
                item.age += (item.age > 1 && ' hours') || ' hour';
            }
            item.size = pretty(item.size);
        });
        res.render('profile/account/' + page, { title: 'AniDex', user: req.user, message: req.flash(), torrents: data, page: page });
    });
}

var renderGroups = function (req, res, page) {
    res.render('profile/account/' + page, { title: 'AniDex', user: req.user, message: req.flash(), page: page });
}

exports.user = function (req, res) {
    var page = req.param('page');
    if (!page) {
        return res.redirect('account/settings');
    }
    
    switch (page) {
        case 'settings':
            renderSettings(req, res, page); break;
        case 'messages':
            break;
        case 'torrents':
            renderTorrents(req, res, page); break;
        case 'groups':
            renderGroups(req, res, page); break;
        case 'comments':
            break;
        default:
            renderSettings(req, res, 'settings'); break;
    }    
};

exports.group = function(req, res) {
    //var group = req.param('id');
    res.send(204);
};
