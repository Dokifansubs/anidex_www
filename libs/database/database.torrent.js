var utils = require(APPROOT + '/libs/helpers/utils');

exports.findTorrents = function (name, start, limit, done) {
  name = name.split(' ');

  var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` ' +
      'FROM `torrent` ' +
      'LEFT JOIN `ai_categories` ' +
      'ON `ai_categories`.`category_id` = `torrent`.`category_id` ';

  // Add LIKE query for each word in search.
  // TODO: Can't this be more efficient?
  for (var i = 0; i < name.length; i++) {
    name[i] = '%' + name[i] + '%';
    if (i === 0) {
      query += 'WHERE ';
    }
    query += '`filename` LIKE ? ';
    if (i !== name.length - 1) {
      query += 'AND ';
    }
  }

  query += 'ORDER BY `torrent_id` ' +
      'DESC LIMIT ?, ?';

  // Flatten names into arguments array.
  var args = _.flatten([name, start, limit]);

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err, []);
      } else {
        return done(undefined, rows);
      }
    });
  });
};

exports.getTorrent = function (id, done) {
  var query = 'SELECT `torrent_id`, `category_name`, `filename`, `size`, `created`, `complete`, `incomplete`, `downloaded`, `info_hash`, `ai_groups`.name as `group_name`, `torrent`.group_id as `group_id`, `username`, `torrent`.user_id as `user_id`, `ai_groups`.website as `website` ' +
      'FROM `torrent` ' +
      'LEFT JOIN `ai_categories` ' +
      'ON `ai_categories`.category_id = `torrent`.category_id ' +
      'LEFT JOIN `ai_users` ' +
      'ON `ai_users`.user_id = `torrent`.user_id ' +
      'LEFT JOIN `ai_groups` ' +
      'ON `ai_groups`.group_id = `torrent`.group_id ' +
      'WHERE `torrent`.torrent_id = ?';
  var args = [id];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err, []);
      } else {
        return done(undefined, rows[0]);
      }
    });
  });
};

exports.updateTorrent = function (id, data, done) {
  var query = 'UPDATE `torrent`, ';
}

// Gets a torrent listing for display on front page.
exports.getTorrents = function (start, limit, done) {
  var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` ' +
      'FROM `torrent` ' +
      'LEFT JOIN `ai_categories` ' +
      'ON `ai_categories`.category_id = `torrent`.category_id ' +
      'ORDER BY `torrent_id` ' +
      'DESC LIMIT ?, ?';
  var args = [start, limit];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err, []);
      } else {
        return done(undefined, rows);
      }
    });
  });
};

exports.getTorrentsByGroup = function (id, start, limit, done) {
  var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` ' +
      'FROM `torrent` ' +
      'LEFT JOIN `ai_categories` ' +
      'ON `ai_categories`.category_id = `torrent`.category_id ' +
      'WHERE `group_id` = ? ' +
      'ORDER BY `torrent_id` ' +
      'DESC LIMIT ?, ?';

  var args = [id, start, limit];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err, []);
      } else {
        return done(undefined, rows);
      }
    });
  });
};

exports.getTorrentsByUser = function (id, start, limit, done) {
  var query = 'SELECT `torrent_id`, `category_name`, `filename`, `comments`, `size`, `created`, `complete`, `incomplete`, `downloaded` ' +
      'FROM `torrent` ' +
      'LEFT JOIN `ai_categories` ' +
      'ON `ai_categories`.category_id = `torrent`.category_id ' +
      'WHERE `user_id` = ? ' +
      'ORDER BY `torrent_id` ' +
      'DESC LIMIT ?, ?';

  var args = [id, start, limit];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err, []);
      } else {
        return done(undefined, rows);
      }
    });
  });
}

exports.addTorrent = function (torrent, done) {
  var query = 'INSERT INTO `torrent` ' +
      '(`info_hash`, `category_id`, `user_id`, `filename`, `group_id`, `description`, `size`) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)';

  torrent.group_id = torrent.group_id || 0;

  var args = [torrent.infoHash, torrent.category_id, torrent.user_id, torrent.filename, torrent.group_id, torrent.description, torrent.length];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, result) {
      connection.release();
      if (err) {
        return done(err, null);
      }

      done(null, result.insertId);
    });
  });
};
