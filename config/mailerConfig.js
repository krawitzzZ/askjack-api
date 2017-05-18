const mandrillTransport = require('nodemailer-mandrill-transport');

const apiKey = process.env.API_KEY;

module.exports = {
  development: {
    jsonTransport: true,
  },
  production: mandrillTransport({
    auth: {
      apiKey,
    },
  }),
};
