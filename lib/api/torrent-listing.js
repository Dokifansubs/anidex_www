
exports.single = function(req, res) {
    database.getTorrent(req.param('id'), function(err, data) {
        if (!data) { return res.render('torrent', {title: 'AniDex', user: req.user }); }
        data.created = moment(data.created);
        data.size = pretty(data.size);
        res.render('torrent', {title: 'AniDex', torrent: data, user: req.user});
    });
}

exports.multi = function(req, res) {
    var category = req.param('cat');
    var group = req.param('group');
    var user = req.param('user');
    var search_term = req.param('search-term');
    var filters = req.param('filter');

}