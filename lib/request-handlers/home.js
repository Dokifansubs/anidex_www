'use strict';

exports._renderFront = renderFront;

exports.index = function(req, res) {
    var obj = {};
    obj.title = 'AniDex';
    obj.user = req.user;

    if (req.query.q) {
        database.findTorrents(req.query.q, 0, 50, function(err, torrents) {
            obj.torrents = torrents;
            renderFront(res, obj);
        });
    } else {
        database.getTorrents(0, 50, function(err, torrents) {
            obj.torrents = torrents;
            renderFront(res, obj);
        });
    }
}

function renderFront(res, obj) {
    obj.torrents.forEach(function(item) {
        item.created = moment(item.created).fromNow();
        item.size = pretty(item.size);
    });
    res.render('index', obj);
};
