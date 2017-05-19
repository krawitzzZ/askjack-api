const mandrillTransport = require('nodemailer-mandrill-transport');

const apiKey = process.env.API_KEY;

module.exports = {
  test: {
    jsonTransport: true,
  },
  development: {
    jsonTransport: true,
  },
  production: mandrillTransport({
    auth: {
      apiKey,
    },
  }),
};
