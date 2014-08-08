User.prototype.validPassword = function(password) {
	return this.password === password;
};

function User(id, username, password) {
	this.id = id;
	this.username = username;
	this.password = password;
};

module.exports = User;