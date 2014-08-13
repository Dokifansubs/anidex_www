'use strict';

var database = {};

exports.init = function(db) {
    database = db;
}

var detail = function(req, res) {
    var group_id = req.param('id');
    database.getGroupById(group_id, function(err, group) {
        return res.render('group', { title: 'AniDex', data: group});
    });
}

var list = function(req, res) {
    database.getGroups(0, 50, function(err, groups) {
        return res.render('groups', { title: 'AniDex', data: groups});
    })
}

exports.group = function(req, res) {
    if (req.param('id')) {
        return detail(req, res);
    } else {
        return list(req, res);
    }
}