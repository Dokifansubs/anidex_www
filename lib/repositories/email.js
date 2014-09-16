var ServerConfig = require('./../../conf/server.json');
var ES = ServerConfig.email;
var EM = {};
module.exports = EM;

EM.server = require('emailjs/email').server.connect({
    host: ES.host,
    user: ES.user,
    password: ES.password,
    ssl: true
});

EM.dispatchResetPasswordLink = function(account, callback) {
    EM.server.send({
        from: ES.sender,
        to: account.email,
        subject: 'AniDex Password Reset',
        text: 'Try to remember it this time!',
        attachment: EM.composeResetLink(account)
    }, function(err, message) {});
};

EM.composeResetLink = function(o) {
    var link = 'http://' + ServerConfig.domain + '/reset-password?h=' + o.ident_hash;
    var html = "<html><body>";
        html += "Hi " + o.username + ",<br><br>";
        html += "Your username is :: <b>" + o.username + "</b><br><br>";
        html += "<a href='" + link + "'>" + link + "</a><br><br>";
        html += "Greetings,<br>";
        html += "The AniDex Team";
        html += "</body></html>";
    return  [{data:html, alternative:true}];
};

EM.dispatchVerifyAccount = function(account, callback) {
    EM.server.send({
        from: ES.sender,
        to: account.email,
        subject: 'AniDex Account Validation',
        text: 'AniDex registration.',
        attachment: EM.composeVerifyLink(account)
    }, function(err, message) {});
};

EM.composeVerifyLink = function(o) {
    // TODO: Change link to https?
    var link = 'http://' + ServerConfig.domain + '/verify-account?h=' + o.ident_hash;
    var html = "<html><body>";
        html += "Hi " + o.username + ",<br><br>";
        html += "This email contains a link to validate your email, if you did not register on the site, you can safely ignore this email<br><br>";
        html += "<a href='" + link + "'>" + link + "</a><br><br>";
        html += "Greetings,<br>";
        html += "The AniDex Team";
        html += "</body></html>";
    return [{data:html, alternative:true}];
};