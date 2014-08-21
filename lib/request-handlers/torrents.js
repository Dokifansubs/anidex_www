'use strict';

var database = {};
var _ = require('lodash');
var moment = require('moment');
var pretty = require('prettysize');
var fs = require('fs');
var readTorrent = require('read-torrent');
var parseTorrent = require('parse-torrent');

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
    res.render('advUpload', {title: 'AniDex', user: req.user, categories: JSON.stringify(['anime-english', 'anime-raw', 'book-english', 'book-raw', 'music-lossy', 'music-lossless'])});
}

exports.parseFile = function(req, res) {
    if (!req.isAuthenticated()) { return res.send(401, { error: 'user not authorised.'}); }

    var file = req.files.torrent;
    readTorrent(file.path, function(err, torrent) {
        console.log(torrent.name);
        res.send(torrent);
        fs.unlink(file.path, function() {});
    });
}

exports.uploadFile = function(req, res) {
    if (!req.isAuthenticated()) { return res.send(401, { error: 'user not authorised.'}); }
    if (!Array.isArray(req.files.torrent)) {
        req.files.torrent = [req.files.torrent];
    }

    var torrents = req.files.torrent;
    _.forEach(torrents, function(item) {
        if (item.type !== 'application/x-bittorrent') { return; }


    })
    torrents.forEach(function(item) {
        var torrentInfo = {};
        if (item.type === 'application/x-bittorrent') {
            var parsed = parseTorrent(fs.readFileSync(item.path));
            torrentInfo.name = parsed.name
            torrentInfo.infoHash = parsed.infoHash;
            torrentInfo.size = pretty(parsed.length);
            console.log(parsed.name);

            // TODO: Add file structure info.

            fs.unlink(item.path, function() {});
        } else {
            torrentInfo.name = 'Not a torrent file';
        }
        torrentsInfo.push(torrentInfo);
    });
}