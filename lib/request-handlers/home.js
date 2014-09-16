'use strict';

var database = {};
var moment = require('moment');
var pretty = require('prettysize');

exports._renderFront = renderFront;

exports.init = function(db) {
    database = db;
}

exports.index = function(req, res) {
    var obj = {};
    obj.title = 'AniDex';
    obj.user = req.user;

    if (req.query.q) {
        database.findTorrents(req.query.q, 0, 50, function(err, torrents) {
            obj.torrents = torrents;
            renderFront(res, obj);
        });
    } else {
        database.getTorrents(0, 50, function(err, torrents) {
            obj.torrents = torrents;
            renderFront(res, obj);
        });
    }
}

function renderFront(res, obj) {
    obj.torrents.forEach(function(item) {
        item.created = moment(item.created);
        item.age = moment().diff(item.created, 'hours');
        if (item.age <= 0) {
            item.age = moment().diff(item.created, 'minutes') + ' min';
        } else if (item.age > 48) {
            item.age = moment().diff(item.created, 'days') + ' days';
        } else {
            item.age += (item.age > 1 && ' hours') || ' hour';
        }
        item.size = pretty(item.size);
    });
    res.render('torrent/torrents', obj);
};
