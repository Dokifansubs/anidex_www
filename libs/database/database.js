/*jslint node: true */
'use strict';

var crypto      = require('crypto');
var mysql       = require('mysql');
var bcrypt      = require('bcrypt');
var _           = require('lodash');

var User        = require('./user');
var MySQLConfig = require(APPROOT + '/conf/server.json').mysql;

GLOBAL.DATABASE_POOL = mysql.createPool(MySQLConfig);

exports.admin       = require(APPROOT + '/libs/database/database.admin');
exports.categories  = require(APPROOT + '/libs/database/database.categories');
exports.group       = require(APPROOT + '/libs/database/database.group');
exports.torrent     = require(APPROOT + '/libs/database/database.torrent');
exports.user        = require(APPROOT + '/libs/database/database.user');