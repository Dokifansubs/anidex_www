'use strict';

var bcrypt = require('bcrypt');

exports.randomString = function(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.encryptPassword = function(password, done) {
  bcrypt.genSalt(10, function(err, salt) {
    // TODO: Handle errors.
    bcrypt.hash(password, salt, function(err, hash) {
      done(err, hash);
    });
  });
};