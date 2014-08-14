'use strict';

var database = {};
var moment = require('moment');
var pretty = require('prettysize');
var fs = require('fs');
var readTorrent = require('read-torrent');

exports.init = function(db) {
    database = db;
}

exports.single = function(req, res) {
    database.getTorrent(req.param('id'), function(err, data) {
        if (!data) { return res.render('torrent', {title: 'AniDex', user: req.user }); }
        data.created = moment(data.created);
        data.size = pretty(data.size);
        res.render('torrent', {title: 'AniDex', torrent: data, user: req.user});
    });
}

exports.upload = function(req, res) {
    res.render('upload', {title: 'AniDex', user: req.user});
}

exports.advUpload = function(req, res) {
    res.render('advUpload', {title: 'AniDex', user: req.user});
}

exports.uploadFile = function(req, res) {
    readTorrent(req.files.torrent.path, function(err, torrent) {
        console.log(torrent.name);
        console.log(torrent.infoHash);
        console.log(torrent.length);
        res.send(torrent);
    });
}