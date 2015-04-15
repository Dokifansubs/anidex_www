'use strict';

var _ = require('lodash');
var moment = require('moment');
var pretty = require('prettysize');
var fs = require('fs');
var readTorrent = require('read-torrent');
var parseTorrent = require('parse-torrent');

var database = require('../repositories/database');
var ServerConfig = require('./../../conf/server.json');

exports.search = function(req, res) {
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
};

exports.single = function(req, res) {
    database.getTorrent(req.param('id'), function(err, data) {
        if (data) {
            data.created = moment(data.created);
            data.size = pretty(data.size);
        }
        res.render('torrent/torrent', {title: 'AniDex', torrent: data, user: req.user});
    });
};

exports.uploadSelect = function (req, res) {
    res.render('torrent/uploadSelect', { title: 'AniDex', user: req.user, message: req.flash() });
};

exports.upload = function (req, res) {
    var group_id = parseInt(req.param('id'));

    database.getCategories(function (err, data) {
        if (isNaN(group_id)) {
            // individual upload
            res.render('torrent/upload', {title: 'AniDex', user: req.user, message: req.flash(), categories: data});
        } else {
            // group upload
            res.render('torrent/upload', { title: 'AniDex', user: req.user, group_id: group_id, message: req.flash(), categories: data });
        }
    });
};

/**
 * Not in use at the moment
**/
exports.advUpload = function(req, res) {
    res.render('torrent/advUpload', {title: 'AniDex', user: req.user, categories: JSON.stringify(['anime-english', 'anime-raw', 'book-english', 'book-raw', 'music-lossy', 'music-lossless'])});
};

exports.parseFile = function(req, res) {
    var file = req.files.torrent;

    if (!req.isAuthenticated()) {
        fs.unlink(file.path, function() {});
        return res.send(401, { error: 'user not authorised.'});
    }

    var parsed = parseTorrent(fs.readFileSync(file.path));
    console.log(parsed.name);

    readTorrent(file.path, function(err, torrent) {
        console.log(torrent.name);
        res.send(torrent);
        fs.unlink(file.path, function() {});
    });
};

exports.downloadFile = function(req, res) {
    database.getTorrent(req.param('id'), function(err, data) {
        if (!data) { return res.redirect('/'); }
        res.set('Content-Disposition', 'attachment; filename="' + data.filename + '.torrent' + '"');
        // BUG: Change this to sendFile in case we upgrade to Express 4.x.
        res.sendfile('./public/torrents/' + data.info_hash + '.btf');
    });
};

exports.uploadFile = function(req, res) {
    if (!Array.isArray(req.files.torrent)) {
        req.files.torrent = [req.files.torrent];
    }

    var torrents = req.files.torrent;
    // Nothing to see here code beauty commitee, move along please.
    var group_id = req.param('group_id');
    var group_id_int = parseInt(group_id);

    // Prevent unauthorised users from uploading, or users uploading to a group they
    // don't belong to.
    if (!req.isAuthenticated() || (!isNaN(group_id_int) && !req.user.isInGroup(group_id_int))) {
        torrents.forEach(function(item) {
            fs.unlink(item.path, function() {});
        });
        return res.send(401, { error: 'user not authorised.'});
    }

    // Check if all files are x-bittorrent files.
    // Can be async
    _.forEach(torrents, function(item) {
        if (item.type !== 'application/x-bittorrent') {
            // if not, delete if from disk.
            fs.unlink(item.path, function () { });
            return;
        }
    });

    // Needs to be sync for reasons I forgot.
    torrents.forEach(function(item) {
        if (item.type === 'application/x-bittorrent') {
            var parsed = parseTorrent(fs.readFileSync(item.path));
            parsed.category_id = req.body.category;

            if (req.user) {
                parsed.user_id = req.user.id;
            } else {
                parsed.user_id = 11;
            }

            // TODO: Add our tracker to announce list if it doesn't exist.
            parsed.group_id = req.body.group_id;
            parsed.filename = parsed.name;
            parsed.description = req.body.description;

            // BUG: This actually doesn't work with more than 1 torrent, because of the return.
            database.addTorrent(parsed, function(err, torrentid) {
                if (err) {
                    console.log(err);
                    fs.unlink(item.path, function() {});
                    if (err.errno === 1062) {
                        req.flash('error', 'Torrent already exists.');
                    } else {
                        req.flash('error', 'Database error, please try again later.');
                    }
                    return res.redirect('/upload/' + group_id);
                }

                fs.rename(item.path, './public/torrents/' + parsed.infoHash + '.btf', function(err) {
                    if (err) {
                        console.log(err);
                        fs.unlink(item.path, function() {});
                        req.flash('error', 'Unable to write torrent to disk, please inform an administrator.');
                        return res.redirect('/upload');
                    }
                    req.flash('info', 'Torrent successfully uploaded!');
                    return res.redirect('/upload/' + group_id);
                });
            });
        }
    });

    // No files uploaded.
    if (torrents.length == 1 && torrents[0].size == 0) {
        res.redirect('/upload/' + group_id);
    }
};


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
}
