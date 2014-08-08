//var CT = require('./modules/country-list');
//var AM = require('./modules/account-manager');
//var EM = require('./modules/email-dispatcher');

// Native requires.
var fs = require('fs');
var moment = require('moment');
var pretty = require('prettysize');
var passport = require('passport');

// Local requires.
var Database = require('./../database/database');

var database = new Database();
moment.langData('en').relativeTime.s = "just now";

function renderFront(res, obj) {
    obj.torrents.forEach(function(item) {
        item.created = moment(item.created).fromNow();
        item.size = pretty(item.size);
    });
    res.render('index', obj);
};

module.exports = function(app) {
    app.get('/', function(req, res) {
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
    });

    app.get('/torrent', function(req, res) {
        database.getTorrent(req.query.id, function(err, data) {
            data.created = moment(data.created);
            data.size = pretty(data.size);
            res.render('torrent', {title: 'AniDex', torrent: data, user: req.user});
        });
    });

    app.get('/upload', function(req, res) {
        var upload = JSON.parse(fs.readFileSync(__dirname + '/upload.json'));
        res.render('upload', {title: 'AniDex', upload: upload, user: req.user});
    });

    app.get('/register', function(req, res) {
        res.render('register', {title: 'AniDex', user: req.user});
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login' })
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}
