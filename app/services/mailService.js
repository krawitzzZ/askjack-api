const nodemailer = require('nodemailer');
const config = require('../../config').transportConfig;

const env = process.env.NODE_ENV || 'development';
const transporter = nodemailer.createTransport(config[env]);

module.exports = {
  sendMail(options) {
    transporter.sendMail(options, (err, info) => {
      console.log('Email sent. ', info.message);
    });
  },
};
