'use strict';

var path				= require('path');
var express				= require('express');
var redis				= require('redis');
var passport			= require('passport');
var LocalStrategy		= require('passport-local').Strategy;
var RememberMeStrategy	= require('passport-remember-me').Strategy;
var flash				= require('connect-flash');

var ServerConfig		= require(APPROOT + '/conf/server.json');
var perfomance			= require(APPROOT + '/libs/perfomance');

app.set('port', ServerConifg.port || 3000);

GLOBAL.APP = module.exports = express();
GLOBAL.APPROOT = path.resolve(__dirname);
GLOBAL.REDIS = redis.createClient();

if (process.env.NODE_ENV === 'production') {
	var session = require('express-session');
    var redisStore = require('connect-redis')(session);
    app.use(session({
        store: new redisStore(ServerConfig.session.redis || {}),
        secret: ServerConfig.session.secret
    }));    
} else {
    app.use(express.session({secret: ServerConfig.session.secret}));
	app.use(express.errorHandler());
}

app.use(express.bodyParser({uploadDir: APPROOT + '/public/torrents'}));
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(__dirname + '/public'));

app.use(perfomance.benchmark);

app.get('/loaderio-094ab3c6cfc055608e961c10e670e233', function(req, res) {
  res.send('loaderio-094ab3c6cfc055608e961c10e670e233');
});

// Start the server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});