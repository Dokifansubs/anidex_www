var ES = require('./../../conf/email.json');
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
    }, callback);
};

EM.composeResetLink = function(o) {
    var link = 'http://anidex.moe:8008/reset-password?e=' + o.email + '&p=' + o.password;
    var html = "<html><body>";
        html += "Hi " + o.username + ",<br><br>";
        html += "Your username is :: <b>" + o.username + "</b><br><br>";
        html += "<a href='" + link + "'>Please click here to reset your password</a><br><br>";
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
    }, function(err, message) {
        console.log(err || message);
    });
};

EM.composeVerifyLink = function(o) {
    // TODO: Change link to https and final port number!
    var link = 'http://anidex.moe:8008/verify-account?e=' + o.email + '&p=' + o.password;
    var html = "<html><body>";
        html += "Hi " + o.username + ",<br><br>";
        html += "This email contains a link to validate your email, if you did not register on the site, you can safely ignore this email<br><br>";
        html += "<a href='" + link + "'>Please click here to validate</a><br><br>";
        html += "Greetings,<br>";
        html += "The AniDex Team";
        html += "</body></html>";
    return [{data:html, alternative:true}];
};