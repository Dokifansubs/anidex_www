exports.get = function (done) {
  var query = 'SELECT `category_id`, `category_name` ' +
      'FROM `ai_categories` ' +
      'ORDER BY `category_id` ASC';

  var args = [];

  DATABASE_POOL.getConnection(function (err, connection) {
    connection.query(query, args, function (err, rows) {
      return done(err, rows || []);
    });
  });
};

exports.add = function (name, done) {
  return done(NYI_ERROR, null);
};

exports.delete = function (id, done) {
  return done(NYI_ERROR, null);
};

exports.rename = function(id, name, done) {
  return done(NYI_ERROR, null);
};