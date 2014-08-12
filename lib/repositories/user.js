var bcrypt = require('bcrypt');

User.prototype.validPassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, res) {
        // TODO: Error handling?
        done(res);
    });
};

User.prototype.verified = function() {
    return this.ver;
}

function User(id, username, password, verified) {
	this.id = id;
	this.username = username;
	this.password = password;
    this.ver = verified === 1 ? true : false;
};

module.exports = User;