//var CT = require('./modules/country-list');
//var AM = require('./modules/account-manager');
//var EM = require('./modules/email-dispatcher');
var fs = require('fs');

module.exports = function(app) {
    app.get('/', function(req, res) {
        var torrents = JSON.parse(fs.readFileSync(__dirname + '/torrents.json'));
        res.render('index', {title: 'AniDex', torrents: torrents});
    });

    app.get('/torrent', function(req, res) {
        var data = JSON.parse(fs.readFileSync(__dirname + '/torrent-details.json'));
        res.render('torrent', {title: 'AniDex', torrent: data});
    });
    
    app.get('/upload', function(req, res) {
        var upload = JSON.parse(fs.readFileSync(__dirname + '/upload.json'));
        res.render('upload', {title: 'AniDex', upload: upload});
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
