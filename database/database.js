// Native requires.
var fs = require('fs');

// package.json requires.
var mysql = require('mysql');
var _ = require('lodash');

// Local requires.
var mysqlconf = require('./../conf/mysql.json');

// Gets a torrent listing for display on front page.
Database.prototype.getTorrents = function(start, limit, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN (`ai_categories`) '
        + 'ON (`ai_categories`.category_id = `torrent`.category_id) '
        + 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';
    var arguments = [start, limit];

    this.connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    }.bind(this));
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
    });
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