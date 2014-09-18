'use strict';

/**
 * AniDex front end.
 * Copyright (c) 2014 Doki Enterprises
**/

var express = require('express');
var ServerConfig = require('./conf/server.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

if (process.env.NODE_ENV === 'production') {
    var session = require('express-session');
    var redisStore = require('connect-redis')(session); 
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

app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// Configure passport handling
var passHandler = require('./lib/helpers/passport');
passport.use(new LocalStrategy(passHandler.login));
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
app.post('/update-password', passHandler.ensureAuthenticated, profile.updatePassword);

var management = require('./lib/request-handlers/management');
// TODO: Add authentication middleware.
app.get('/account', passHandler.ensureAuthenticated, management.user);
app.get('/account-group/:id', passHandler.ensureAuthenticated, management.group);

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

app.post('/register', profile.registerForm);

app.get('/loaderio-094ab3c6cfc055608e961c10e670e233', function(req, res) {
  res.send('loaderio-094ab3c6cfc055608e961c10e670e233');
});


// Start the server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
