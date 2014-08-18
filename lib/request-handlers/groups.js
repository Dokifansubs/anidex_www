'use strict';

var database = {};
var moment = require('moment');

exports.init = function(db) {
    database = db;
}

exports.detail = function(req, res) {
    var group_id = req.param('id');
    database.getGroupById(group_id, function(err, data) {
        return res.render('group', { title: 'AniDex', group: data});
    });
}

exports.list = function(req, res) {
    database.getGroups(0, 50, function(err, groups) {
        groups.forEach(function(item){
            item.founded_timestamp = moment(item.founded_timestamp).format("MMM Do YYYY");
        });
        return res.render('groups', { title: 'AniDex', data: groups});
    })
}
