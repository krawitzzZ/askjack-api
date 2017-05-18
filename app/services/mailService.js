var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var config = require('../../config').transportConfig;

var env = process.env.NODE_ENV || 'development';
var apiKey = process.env.MANDRILL_API_KEY;

var transporter = nodemailer.createTransport(config[env]);

module.exports = {
    sendMail: function sendMail (options) {
        transporter.sendMail(options, function(err, info) {
            console.log(info.envelope);
            console.log(info.messageId);
            console.log(info.message);
        })}
};