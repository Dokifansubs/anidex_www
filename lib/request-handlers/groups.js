'use strict';

var moment = require('moment');
var pretty = require('prettysize');

var database = require('../repositories/database');

exports.detail = function(req, res) {
    var group_id = req.param('id');
    database.getGroupById(group_id, function(err, group) {
        if (!group) {
            return res.redirect('/groups');
        }
        group.founded_timestamp = moment(group.founded_timestamp).format('YYYY-MMM-DD');
        database.getTorrentsByGroup(group_id, 0, 50, function(err, data) {
            if (err) { return res.redirect('/'); }
            data.forEach(function(item) {
                item.created = moment(item.created).fromNow(true);
                item.size = pretty(item.size);
            });
            return res.render('group', { title: 'AniDex', data: group, torrents: data});
        });
    });
};

exports.list = function(req, res) {
    database.getGroups(0, 50, function(err, groups) {
        groups.forEach(function(item){
            item.founded_timestamp = moment(item.founded_timestamp).format('YYYY-MMM-DD');
        });
        return res.render('groups', { title: 'AniDex', data: groups});
    });
};
