var orm = require('orm');
var ServerConfig = require('../../conf/server.json');

exports.whitelist = function (req, res) {

    orm.connect('mysql://' + ServerConfig.mysql.user + ':' + ServerConfig.mysql.password + '@' + ServerConfig.mysql.host + '/' + 'nodetracker', function(err, db) {
        var torrents = db.define('torrent', {
            id : { type : 'serial', key: true, mapsTo: 'torrent_id'},
            info_hash  : { type : 'text', size: 40, unique: true},
            complete   : { type : 'integer'},
            incomplete : { type : 'integer'},
            downloaded : { type : 'integer'},
            cat_id     : { type : 'integer', mapsTo: 'category_id'},
            user_id    : { type : 'integer'},
            group_id   : { type : 'integer'},
            created    : { type : 'date', time: true},
            filename   : { type : 'text', size: 255},
            description: { type : 'text'},
            size       : { type : 'integer', size: 4},
            comments   : { type : 'integer'}
        });

        torrents.find({created: orm.gt(new Date(parseInt(req.param('ts')) * 1000))})
            .only('info_hash').run(function(err, torrents) {
                if (err) throw err;

                res.writeHead(200, {'Content-Type': 'text/plain'});
                torrents.forEach(function(element, index, array) {
                    res.write(element['info_hash']);
                    res.write('\n');
                });
                res.end();
            });
    });


};

