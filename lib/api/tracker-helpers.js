var orm = require('orm');

exports.whitelist = function (req, res) {
    req.models.torrents.find({created: orm.gt(new Date(parseInt(req.param('ts')) * 1000))})
        .only('info_hash').run(function (err, torrents) {

        if (err) throw err;

        res.writeHead(200, {'Content-Type': 'text/plain'});
        torrents.forEach(function(element, index, array) {
            res.write(element['info_hash']);
            res.write('\n');
        });            
        res.end();
    });
};