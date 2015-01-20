var api_get   = require(APPROOT + '/api/router.get');
var api_post  = require(APPROOT + '/api/router.post');

APP.get('/api/torrent', api_get.torrents);
APP.get('/whitelist', api_get.whitelist);
APP.post('/api/torrent', api_post.upload);