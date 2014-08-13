/**
 * AniDex front end.
 * Copyright (c) 2014 Doki Enterprises
**/

var express = require('express');
var http = require('http');
var sessionConfig = require('./conf/session.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var colors = require('colors');
var flash = require('connect-flash');

var database = require('./lib/repositories/database');

var app = module.exports = express();

app.set('port', 8008);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session(sessionConfig));
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
passHandler.init(database);
passport.use(new LocalStrategy(passHandler.login));
passport.serializeUser(passHandler.serialize);
passport.deserializeUser(passHandler.deserialize)


/*
 * Routes handlers
 */

var home = require('./lib/request-handlers/home')
home.init(database);
app.get('/', home.index);

var torrent = require('./lib/request-handlers/torrent');
torrent.init(database);
app.get('/torrent', torrent.single);
app.get('/upload', torrent.upload);

var group = require('./lib/request-handlers/group');
group.init(database);
app.get('/group', group.group);

var profile = require('./lib/request-handlers/profile');
profile.init(database);
app.get('/register', profile.register);
app.get('/login', profile.login);
app.get('/logout', profile.logout);
app.get('/verify-account', profile.verify);

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

app.post('/register', profile.registerForm);


// Start the server
app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
    console.log("UPDATE EMAIL SYSTEM IN FINAL VERSION".red);
});
