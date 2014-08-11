User.prototype.validPassword = function(password) {
	return this.password === password;
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