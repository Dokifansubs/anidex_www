'use strict';

exports.single = function(req, res) {
    database.getTorrent(req.query.id, function(err, data) {
        if (!data) { return res.render('torrent', {title: 'AniDex', user: req.user }); }
        data.created = moment(data.created);
        data.size = pretty(data.size);
        res.render('torrent', {title: 'AniDex', torrent: data, user: req.user});
    });
}

exports.upload = function(req, res) {
    var upload = JSON.parse(fs.readFileSync(__dirname + '/upload.json'));
    res.render('upload', {title: 'AniDex', upload: upload, user: req.user});
}