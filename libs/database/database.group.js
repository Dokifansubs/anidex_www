var utils = require(APPROOT + '/libs/helpers/utils');

exports.getGroups = function (start, limit, done) {
  var query = 'SELECT * ' +
      'FROM `ai_groups` ' +
      'ORDER BY `name` ' +
      'ASC LIMIT ?, ?';
  var args = [start, limit];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      return done(err, rows || []);
    });
  });
};

exports.getGroupById = function (id, done) {
  var query = 'SELECT `group_id`, `name`, `short_name`, `leader_id`, `founded_timestamp`, `language`, `website`, `irc_channel`, `irc_server`, `contact`, `banner`, `description`, `username` ' +
      'FROM `ai_groups` ' +
      'LEFT JOIN `ai_users` ' +
      'ON `ai_users`.user_id = `ai_groups`.leader_id ' +
      'WHERE `group_id` = ?';
  var args = [id];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (rows.length === 0) {
        return done(null, null);
      }
      return done(null, rows[0]);
    });
  });
};