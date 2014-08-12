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

var Database = require('./database/database');

var app = module.exports = express();
var database = new Database();

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
passport.use(new LocalStrategy(passHandler.login));
passport.serializeUser(passHandler.serialize);
passport.deserializeUser(passHandler.deserialize)


/*
 * Routes handlers
 */

var home = require('./lib/request-handlers/home')
app.get('/', home.index);

var torrent = require('./lib/request-handlers/torrent');
app.get('/torrent', torrent.single);
app.get('/upload', torrent.upload);

var profile = require('./lib/request-handlers/profile');
app.get('/register', profile.register);
app.get('/login', profile.loginForm);
app.get('/logout', profile.logout);

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);


// Start the server
app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
    console.log("UPDATE EMAIL SYSTEM IN FINAL VERSION".red);
});
