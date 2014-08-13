'use strict';

var database = {};

exports.init = function(db) {
    database = db;
}

exports.detail = function(req, res) {
    var group_id = req.param('id');
    console.log(group_id + ' ' + req.param.id);
    database.getGroupById(group_id, function(err, group) {
        return res.render('group', { title: 'AniDex', data: group});
    });
}

exports.list = function(req, res) {
    database.getGroups(0, 50, function(err, groups) {
        return res.render('groups', { title: 'AniDex', data: groups});
    })
}