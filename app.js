'use strict';

/**
 * AniDex front end.
 * Copyright (c) 2014 Doki Enterprises
**/

var express				= require('express');
var ServerConfig		= require('./conf/server.json');
var passport			= require('passport');
var LocalStrategy		= require('passport-local').Strategy;
var RememberMeStrategy	= require('passport-remember-me').Strategy;
var flash				= require('connect-flash');
var torrent_helpers		= require('./lib/api/tracker-helpers');
var orm					= require('orm');
var Models				= require('./lib/helpers/models.js');
var utils				= require('./lib/helpers/utils.js');
var Token				= require('./lib/helpers/token.js');

if (process.env.NODE_ENV === 'production') {
    var session     = require('express-session');
    var redisStore  = require('connect-redis')(session);
}

var app = module.exports = express();

app.set('port', ServerConfig.port || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser({uploadDir: __dirname + '/public/torrents'}));
app.use(express.cookieParser());

if (process.env.NODE_ENV === 'production') {
    app.use(session({
        store: new redisStore(ServerConfig.session.redis || {}),
        secret: ServerConfig.session.secret
    }));
} else {
    app.use(express.session({secret: ServerConfig.session.secret}));
}

// Configure passport handling
var passHandler = require('./lib/helpers/passport');
passport.use(new LocalStrategy(passHandler.login));
passport.use(new RememberMeStrategy(
	function(token, done) {
		Token.consume(token, function (err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null, user);
		});
	},
	function(user, done) {
		var token = utils.generateToken(64);
		Token.save(token, { userId: user.id }, function(err) {
			if (err) { return done(err); }
			return done(null, token);
		});
	}
));

app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(flash());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));
app.use(orm.express('mysql://' + ServerConfig.mysql.user + ':' + ServerConfig.mysql.password + '@' + ServerConfig.mysql.host + '/' + ServerConfig.mysql.database, {
    define: function (db, models, next) {
        models.torrents = db.define('torrent', Models.torrent);
        next();
    }
}));

if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

passport.serializeUser(passHandler.serialize);
passport.deserializeUser(passHandler.deserialize);

var perfomance = require('./lib/helpers/perfomance');
app.use(perfomance.benchmark);

/*
 * Routes handlers
 */
var torrents = require('./lib/request-handlers/torrents');
app.get('/', torrents.search);
app.get('/torrents/:id', torrents.single);
//app.get('/upload', torrents.upload);
app.get('/upload', passHandler.ensureAuthenticated, torrents.uploadSelect);
app.get('/upload/:id', passHandler.ensureAuthenticated, torrents.upload);
app.post('/upload', torrents.uploadFile);
app.post('/parse', torrents.parseFile);
app.post('/delete', torrents.deleteFile);
/*
app.get('/advupload', passHandler.ensureAuthenticated ,torrents.advUpload);
*/
app.get('/download/:id', torrents.downloadFile);

var groups = require('./lib/request-handlers/groups');
app.get('/groups', groups.list);
app.get('/groups/:id', groups.detail);

var profile = require('./lib/request-handlers/profile');
app.get('/register', profile.register);
app.get('/login', profile.login);
app.get('/logout', profile.logout);
app.get('/verify-account', profile.verify);
app.get('/forgot-password', profile.forgotPassword);
app.get('/recover-password', profile.recoverPassword);
app.post('/register', profile.registerForm);
app.post('/update-password', passHandler.ensureAuthenticated, profile.updatePassword);
app.post('/forgot-password', profile.setRecoverPassword);
app.post('/recover-password', profile.updateRecoverPassword);

var management = require('./lib/request-handlers/management');
app.get('/account', passHandler.ensureAuthenticated, management.user);
app.get('/account/:page', passHandler.ensureAuthenticated, management.user);
app.get('/account-group/:id/:page', passHandler.ensureAuthenticated, management.group);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function(req, res, next) {
		// issue a remember me cookie if the option was checked
		if (!req.body.rememberme) { return next(); }

		var token = utils.randomString(64);
		Token.save(token, { userId: req.user.id }, function(err) {
			if (err) { return done(err); }
			res.cookie('rememberme', token, { path: '/', httpOnly: true, maxAge: 214748364700 });
			return next();
		});
	},
	function(req, res) {
		res.redirect('/');
	}
);

app.get('/loaderio-094ab3c6cfc055608e961c10e670e233', function(req, res) {
  res.send('loaderio-094ab3c6cfc055608e961c10e670e233');
});

app.get('/whitelist', torrent_helpers.whitelist);

// Start the server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
