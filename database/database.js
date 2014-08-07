// Native requires.
var fs = require('fs');

// package.json requires.
var mysql = require('mysql');

// Local requires.
var mysqlconf = require('./../conf/mysql.json');

Database.prototype.findTorrents = function(name, start, limit, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'WHERE `filename` LIKE ?'
        + 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';
    var arguments = ['%' + name + '%', start, limit];

    console.log(query);
    console.log(arguments);

    this.connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    });
};

Database.prototype.getTorrent = function(id, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `size`, `created`, `complete`, `incomplete`, `downloaded`, `info_hash`, `ai_groups`.name as `group_name`, `torrent`.group_id as `group_id`, `username`, `torrent`.user_id as `user_id` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'LEFT JOIN `ai_users` '
        + 'ON `ai_users`.user_id = `torrent`.user_id '
        + 'LEFT JOIN `ai_groups` '
        + 'ON `ai_groups`.group_id = `torrent`.group_id '
        + 'WHERE `torrent`.torrent_id = ?';
    var arguments = [id];

    this.connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows[0]);
        }
    });
};

// Gets a torrent listing for display on front page.
Database.prototype.getTorrents = function(start, limit, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';
    var arguments = [start, limit];

    this.connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    });
};

// Handles disconnect events from server.
Database.prototype.handleDisconnect = function() {
    this.connection.on('error', function(err) {
        if (!err.fatal) {
            // Nothing going on here, move along sir.
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            // No idea what's wrong.
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);
        delete this.connection;
        this.connection = mysql.createConnection(mysqlconf);
        this.handleDisconnect();
        this.connection.connect();
        this.connection.query('USE `nodetracker`', function(err, rows) {
            // Can't go wrong!
        });
    }.bind(this));
};

function Database() {
    this.connection = mysql.createConnection(mysqlconf);
    this.handleDisconnect();
    this.connection.connect();
    this.connection.query('USE `nodetracker`', function(err, rows) {
        // Can't go wrong!
    });
};

module.exports = Database;