// Native requires.
var fs = require('fs');
var crypto = require('crypto');

// package.json requires.
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var _ = require('lodash');

// Local requires.
var mysqlconf = require('../../conf/mysql.json');
var User = require('./user');

var connection = {};

var encryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        // TODO: Handle errors.
        bcrypt.hash(password, salt, function(err, hash) {
            callback(err, hash);
        });
    });
};

exports.getCategories =function(callback) {
    var query = 'SELECT `category_id`, `category_name` '
        + 'FROM `ai_categories` '
        + 'ORDER BY `category_id` ASC';

    var arguments = [];
    connection.query(query, arguments, function(err, rows, fields) {
        return callback(err, rows || []);
    });
}

exports.getGroups = function(start, limit, callback) {
    var query = 'SELECT * '
        + 'FROM `ai_groups` '
        + 'ORDER BY `name` '
        + 'ASC LIMIT ?, ?';
    var arguments = [start, limit];

    connection.query(query, arguments, function(err, rows, fields) {
        return callback(err, rows || []);
    });
}

exports.getGroupById = function(id, callback) {
    var query = 'SELECT `group_id`, `name`, `short_name`, `leader_id`, `founded_timestamp`, `language`, `website`, `irc_channel`, `irc_server`, `contact`, `banner`, `description`, `username` '
        + 'FROM `ai_groups` '
        + 'LEFT JOIN `ai_users` '
        + 'ON `ai_users`.user_id = `ai_groups`.leader_id '
        + 'WHERE `group_id` = ?';
    var arguments = [id];

    connection.query(query, arguments, function(err, rows, fields) {
        if (rows.length == 0) {
            return callback(null, null);
        }
        return callback(null, rows[0]);
    });
}

exports.verifyUser = function(hash, callback) {
    var querySelect = 'SELECT `verified` '
        + 'FROM `ai_users` '
        + 'WHERE `ident_hash` = ?';
    var argumentsSelect = [hash];

    var queryUpdate = 'UPDATE `ai_users` '
        + 'SET `verified` = 1, '
        + '`ident_hash` = NULL '
        + 'WHERE `ident_hash` = ?';
    var argumentsUpdate = [hash];

    var errorReturn = function() {
        callback(err, null);
    }

    connection.beginTransaction(function(err) {
        if (err) {
            return connection.rollback(errorReturn);
        }
        connection.query(querySelect, argumentsSelect, function(err, rows, fields) {
            if (err) {
                return connection.rollback(errorReturn);
            }
            if (rows.length == 0) {
                return connection.rollback(function() {
                    // Account not found.
                    callback(null, null);
                });
            }
            if (rows.length == 1 && rows[0].verified == 1) {
                // Account already verified.
                return connection.rollback(function() {
                    callback(null, 1);
                })
            }
            connection.query(queryUpdate, argumentsUpdate, function(err, result) {
                if (err) {
                    return connection.rollback(errorReturn);
                }
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(errorReturn);
                    }
                    return callback(null, 0);
                });
            });
        });
    });
};

exports.createUser = function(username, password, email, callback) {
    encryptPassword(password, function(err, hash) {
        // TODO: Make sure this hash is unique.
        var id = crypto.randomBytes(20).toString('hex');

        var query = 'INSERT INTO `ai_users` '
            + '(`username`,`password`,`email`,`join_timestamp`,`ident_hash`) '
            + 'VALUES (?, ?, ?, NOW(), ?)';
        var arguments = [username, hash, email, id];

        connection.query(query, arguments, function(err, result) {
            if (err) {
                return callback(err, null);
            }
            return callback(err, result.insertId);
        });
    });
};

// Searches database for email, returns true if exists.
exports.emailExists = function(email, callback) {
    var query = 'SELECT `email` '
        + 'FROM `ai_users` '
        + 'WHERE `email` = ?';
    var arguments = [email];

    connection.query(query, arguments, function(err, rows, fields) {
        if (rows.length > 0) {
            return callback(true);
        }
        return callback(false);
    });
}

exports.findUserId = function(id, callback) {
    var query = 'SELECT `user_id`, `username`, `password`, `verified`, `email`, `ident_hash` '
        + 'FROM `ai_users` '
        + 'WHERE `user_id` = ?';
    var arguments = [id];

    connection.query(query, arguments, function(err, rows, fields) {
        if (err) { return callback(err); }
        if (rows.length == 0) {return callback(null, null); }
        var user = new User(rows[0]);
        return callback(null, user);
    });
};

exports.findUser = function(username, callback) {
    var query = 'SELECT `user_id`, `username`, `password`, `verified`, `email` '
        + 'FROM `ai_users` '
        + 'WHERE `username` = ?';
    var arguments = [username];

    connection.query(query, arguments, function(err, rows, fields) {
        if (err) { return callback(err); }
        if (rows.length == 0) { return callback(null, null); }
        var user = new User(rows[0]);
        return callback(null, user);
    });
};

exports.findTorrents = function(name, start, limit, callback) {
    var name = name.split(' ');

    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.`category_id` = `torrent`.`category_id` ';

    // Add LIKE query for each word in search.
    // TODO: Can't this be more efficient?
    for(var i = 0; i < name.length; i++) {
        name[i] = '%' + name[i] + '%';
        if (i == 0) {
            query += 'WHERE ';
        }
        query += '`filename` LIKE ? ';
        if (i != name.length - 1) {
            query += 'AND ';
        }
    }

    query += 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';

    // Flatten names into arguments array.
    var arguments = _.flatten([name, start, limit]);

    var r = connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    });
};

exports.getTorrent = function(id, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `size`, `created`, `complete`, `incomplete`, `downloaded`, `info_hash`, `ai_groups`.name as `group_name`, `torrent`.group_id as `group_id`, `username`, `torrent`.user_id as `user_id`, `ai_groups`.website as `website` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'LEFT JOIN `ai_users` '
        + 'ON `ai_users`.user_id = `torrent`.user_id '
        + 'LEFT JOIN `ai_groups` '
        + 'ON `ai_groups`.group_id = `torrent`.group_id '
        + 'WHERE `torrent`.torrent_id = ?';
    var arguments = [id];

    connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows[0]);
        }
    });
};

// Gets a torrent listing for display on front page.
exports.getTorrents = function(start, limit, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';
    var arguments = [start, limit];

    connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    });
};

exports.getTorrentsByGroup = function(id, start, limit, callback) {
    var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` '
        + 'FROM `torrent` '
        + 'LEFT JOIN `ai_categories` '
        + 'ON `ai_categories`.category_id = `torrent`.category_id '
        + 'WHERE `group_id` = ? '
        + 'ORDER BY `torrent_id` '
        + 'DESC LIMIT ?, ?';

    var arguments = [id, start, limit];

    connection.query(query, arguments, function(err, rows, fields) {
        if (err) {
            return callback(err, []);
        } else {
            return callback(undefined, rows);
        }
    });
}

exports.addTorrent = function(torrent, callback) {
    var query = 'INSERT INTO `torrent` '
        + '(`info_hash`, `category_id`, `user_id`, `filename`, `group_id`, `description`, `size`) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?)';

    torrent.group_id = torrent.group_id || 0;

    var arguments = [torrent.infoHash, torrent.category_id, torrent.user_id, torrent.filename, torrent.group_id, torrent.description, torrent.length];

    connection.query(query, arguments, function(err, result) {
        if (err) {
            return callback(err, null);
        }

        callback(null, result.insertId);
    });
};

// Handles disconnect events from server.
var handleDisconnect = function() {
    connection.on('error', function(err) {
        if (!err.fatal) {
            // Nothing going on here, move along sir.
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            // No idea what's wrong.
            throw err;
        }

        console.log('Reconnecting lost connection: ' + err.stack);
        delete connection;
        connection = mysql.createConnection(mysqlconf);
        handleDisconnect();
        connection.connect();
        connection.query('USE `nodetracker`', function(err, rows) {
            // Can't go wrong!
        });
    });
};

connection = mysql.createConnection(mysqlconf);
handleDisconnect();
connection.connect();
connection.query('USE `nodetracker`', function(err, rows) {
    // Can't go wrong!
});