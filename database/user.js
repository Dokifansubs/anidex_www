User.prototype.validPassword = function(password) {
	return this.password === password;
};

User.prototype.verified = function() {
    return this.verified;
}

function User(id, username, password, verified) {
	this.id = id;
	this.username = username;
	this.password = password;
    this.verified = verified === 1 ? true : false;
};

module.exports = User;