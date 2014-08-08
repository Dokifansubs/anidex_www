/**
 * AniDex front end.
 * Copyright (c) 2014 Doki Enterprises
**/

var express = require('express');
var http = require('http');
var sessionConfig = require('./conf/session.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Database = require('./database/database');

var app = module.exports = express();
var database = new Database();

app.configure(function() {
    app.set('port', 8008);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(sessionConfig));
    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler());

    passport.use(new LocalStrategy(function(username, password, done) {
        database.findUser(username, function(err, user) {
            if (err) { return done(err) }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        database.findUserId(id, function(err, user) {
            done(null, user);
        });
    })
});

require('./routes/router')(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});