/**
 * AniDex front end.
 * Copyright (c) 2014 Doki Enterprises
**/

var express = require('express');
var http = require('http');
var sessionConfig = require('./conf/session.json');

var app = module.exports = express();

app.configure(function() {
    app.set('port', 8008);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(sessionConfig));
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes/router')(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});