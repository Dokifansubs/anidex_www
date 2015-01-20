var utils = require(APPROOT + '/libs/helpers/utils');

exports.verifyUser = function (hash, done) {
  var querySelect = 'SELECT `verified` ' +
      'FROM `ai_users` ' +
      'WHERE `ident_hash` = ?';
  var argumentsSelect = [hash];

  var queryUpdate = 'UPDATE `ai_users` ' +
      'SET `verified` = 1, ' +
      '`ident_hash` = NULL ' +
      'WHERE `ident_hash` = ?';
  var argumentsUpdate = [hash];

  var errorReturn = function (err) {
    done(err, null);
  };

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        connection.rollback(errorReturn);
        return connection.release();
      }
      connection.query(querySelect, argumentsSelect, function (err, rows) {
        if (err) {
          connection.rollback(errorReturn);
          return connection.release();
        }
        if (rows.length === 0) {
          connection.rollback(function () {
            // Account not found.
            done(null, 2);
            return connection.release();
          });
        }
        connection.query(queryUpdate, argumentsUpdate, function (err) {
          if (err) {
            connection.rollback(errorReturn);
            return connection.release();
          }
          connection.commit(function (err) {
            if (err) {
              connection.rollback(errorReturn);
              return connection.release();
            }
            done(null, 0);
            return connection.release();
          });
        });
      });
    });
  });
};

exports.createUser = function (username, password, email, done) {
  utils.encryptPassword(password, function (err, hash) {
    // TODO: Make sure this hash is unique.
    var id = crypto.randomBytes(20).toString('hex');

    var query = 'INSERT INTO `ai_users` ' +
        '(`username`,`password`,`email`,`join_timestamp`,`ident_hash`) ' +
        'VALUES (?, ?, ?, NOW(), ?)';
    var args = [username, hash, email, id];

    DATABASE_POOL.getConnection(function (err, connection) {
      connection.query(query, args, function (err, result) {
        console.log(err);
        connection.release();
        if (err) {
          return done(err, null);
        }
        return done(err, result.insertId);
      });
    });
  });
};

// Searches database for email, returns true if exists.
exports.emailExists = function (email, done) {
  var query = 'SELECT `email` ' +
      'FROM `ai_users` ' +
      'WHERE `email` = ?';
  var args = [email];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (rows.length > 0) {
        return done(true);
      }
      return done(false);
    });
  });
};

var linkGroups = function (user, done) {
  var query = 'SELECT `user_group`.group_id, `name` AS `group_name` ' +
      'FROM `user_group` ' +
      'LEFT JOIN `ai_groups` ' +
      'ON `user_group`.group_id = `ai_groups`.group_id ' +
      'WHERE `user_id` = ?';
  var args = [user.id];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err);
      }
      user.setGroups(rows);
      return done(null, user);
    });
  });
};

exports.findUserId = function (id, done) {
  var query = 'SELECT `user_id`, `username`, `password`, `verified`, `email`, `ident_hash` ' +
      'FROM `ai_users` ' +
      'WHERE `user_id` = ?';
  var args = [id];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err);
      }
      if (rows.length === 0) {
        return done(null, null);
      }
      var user = new User(rows[0]);
      return linkGroups(user, done);
    });
  });
};

exports.findUserOrEmail = function (identifier, done) {
  var query = 'SELECT `user_id`, `username`, `email` ' +
      'FROM `ai_users` ' +
      'WHERE `username` = ? ' +
      'OR `email` = ?';
  var args = [identifier, identifier];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err);
      }
      if (rows.length === 0) {
        return done();
      }
      var user = new User(rows[0]);
      done(null, user);
    });
  });
};

exports.recoverPassword = function (user, done) {
  var query = 'UPDATE `ai_users` ' +
      'SET `ident_hash` = ? ' +
      'WHERE `user_id` = ?';

  var hash = crypto.randomBytes(20).toString('hex');
  var args = [hash, user.id]

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, results) {
      connection.release();
      user.ident_hash = hash;
      done();
    });
  });
};

exports.findUser = function (username, done) {
  var query = 'SELECT `user_id`, `username`, `password`, `verified`, `email` ' +
      'FROM `ai_users` ' +
      'WHERE `username` = ?';
  var args = [username];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      connection.release();
      if (err) {
        return done(err);
      }
      if (rows.length === 0) {
        return done(null, null);
      }
      var user = new User(rows[0]);
      return linkGroups(user, done);
    });
  });
};

exports.updateRecoverPassword = function (hash, password, done) {
  encryptPassword(password, function (err, hashedpass) {
    var query = 'UPDATE `ai_users` ' +
        'SET `password` = ?, ' +
        '`ident_hash` = NULL ' +
        'WHERE `ident_hash` = ?';
    var args = [hashedpass, hash];

    DATABASE_POOL.getConnection(function (err, connection) {
      connection.query(query, args, function (err, rows) {
        connection.release();
        if (err) {
          return done(err);
        }
        return done(null);
      });
    });
  });
};

exports.updatePassword = function (id, password, done) {
  utils.encryptPassword(password, function (err, hash) {
    var query = 'UPDATE `ai_users` ' +
        'SET `password` = ? ' +
        'WHERE `user_id` = ?';
    var args = [hash, id];

    DATABASE_POOL.getConnection(function (err, connection) {
      connection.query(query, args, function (err) {
        connection.release();
        if (err) {
          return done(err);
        }
        // TODO: Better error handling.
        return done(null);
      });
    });
  });
};
