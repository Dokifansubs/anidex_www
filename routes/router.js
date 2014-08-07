//var CT = require('./modules/country-list');
//var AM = require('./modules/account-manager');
//var EM = require('./modules/email-dispatcher');

// Native requires.
var fs = require('fs');
var moment = require('moment');
var pretty = require('prettysize');

// Local requires.
var Database = require('./../database/database');

var database = new Database();

module.exports = function(app) {
    app.get('/', function(req, res) {
        database.getTorrents(0, 50, function(err, torrents) {
            torrents.forEach(function(item) {
                item.created = moment(item.created).fromNow();
                item.size = pretty(item.size);
            });
            res.render('index', {title: 'AniDex', torrents: torrents});
        });
    });

    app.get('/torrent', function(req, res) {
        database.getTorrent(req.query.id, function(err, data) {
            data.created = moment(data.created);
            data.size = pretty(data.size);
            res.render('torrent', {title: 'AniDex', torrent: data});
        });
    });

    app.get('/upload', function(req, res) {
        var upload = JSON.parse(fs.readFileSync(__dirname + '/upload.json'));
        res.render('upload', {title: 'AniDex', upload: upload});
    });

    app.get('/register', function(req, res) {
        res.render('register', {title: 'AniDex'});
    });

    /*
    app.get('/', function(req, res) {
        // Use a key instead of user password.
        if (req.cookies.user == undefined || req.cookies.key == undefined) {
            res.render('login', { title: 'Hello - Please Login To Your Account ' });
        } else {
            AM.autoLogin(req.cookies.user, req.cookies.key, function(o) {
                if (o != null) {
                    req.session.user = o;
                    res.redirect('/home');
                } else {
                    res.render('login', { title: 'Hello - Please Login To Your Account' });
                }
            });
        }
    });

    app.post('/', function(req, res) {
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, o) {
            if (!o) {
                res.send(e, 400);
            } else {
                req.session.user = o;
                if (req.param('remember-me') == 'true') {
                    res.cookie('user', o.user, {maxAge: 900000 });
                    res.cookie('key', o.key, {maxAge: 900000 });
                }
                res.send(o, 200);
            }
        });
    });
    */
}
