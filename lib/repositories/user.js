'use strict';

var bcrypt = require('bcrypt');
var _ = require('lodash');

User.prototype.validPassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, res) {
        // TODO: Error handling?
        done(res);
    });
};

/**
 * Returns true if user has verified his or her first email address.
**/
User.prototype.verified = function() {
    return this.ver;
};

/**
 * Returns true if user is in the passed group.
 * @param id Id of the group to compare.
**/
User.prototype.isInGroup = function (id) {
    return _.contains(this.groups, { group_name: id });
};

User.prototype.setGroups = function (groups) {
    this.groups = groups;
};

/**
 * Creates a new user object.
 * @param data Row from the database.
 * @param groups list of groups this user belongs to.
**/
function User(data) {
	this.id = data.user_id;
	this.username = data.username;
	this.password = data.password;
    this.ver = data.verified === 1 ? true : false;
    this.email = data.email;
    this.ident_hash = data.ident_hash;    
}

module.exports = User;
