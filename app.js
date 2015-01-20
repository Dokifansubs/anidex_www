'use strict';

var path                = require('path');
var http                = require('http');
var jade                = require('jade');
var express             = require('express');
var session             = require('express-session');
var errorHandler        = require('express-error-handler');
var redis               = require('redis');
var passport            = require('passport');
var LocalStrategy       = require('passport-local').Strategy;
var RememberMeStrategy  = require('passport-remember-me').Strategy;
var flash               = require('connect-flash');

var globals     = require(APPROOT + '/libs/helpers/globals');

GLOBAL.APP      = module.exports = express();
GLOBAL.APPROOT	= path.resolve(__dirname);
GLOBAL.REDIS	= redis.createClient();

var ServerConfig		= require(APPROOT + '/conf/server.json');
var perfomance			= require(APPROOT + '/libs/perfomance');
var server				= http.createServer(APP);

APP.set('port', ServerConfig.port || 3000);
APP.set('views', APPROOT + '/app');
APP.set('view engine', 'jade');
APP.engine('jade', jade.__express);

if (process.env.NODE_ENV === 'production') {
    var redisStore = require('connect-redis')(session);
    APP.use(session({
        store: new redisStore(ServerConfig.session.redis || {}),
        secret: ServerConfig.session.secret
    }));    
} else {
    APP.use(session({secret: ServerConfig.session.secret}));
}

APP.use(passport.initialize());
APP.use(passport.session());
APP.use(flash());
APP.use(express.static(APPROOT + '/public'));
APP.use(errorHandler({server: server}));
APP.use(perfomance.benchmark);

APP.get('/', function(req, res) {
	res.render('components/home/homeView', {});
});

APP.get('/login', function(req, res) {
	res.render('components/login/loginView', {});
});

APP.get('/loaderio-094ab3c6cfc055608e961c10e670e233', function(req, res) {
  res.send('loaderio-094ab3c6cfc055608e961c10e670e233');
});

// Start the server
server.listen(APP.get('port'), function() {
    console.log('Express server listening on port ' + APP.get('port'));
});