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

function User(data) {
	this.id = data.user_id;
	this.username = data.username;
	this.password = data.password;
    this.ver = data.verified === 1 ? true : false;
    this.email = data.email;
    this.ident_hash = data.ident_hash;
};

module.exports = User;