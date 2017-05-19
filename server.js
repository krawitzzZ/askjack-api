const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const pjson = require('./package.json');
const UserRoles = require('./app/enums').UserRoles;
const QuoteStatuses = require('./app/enums').QuoteStatuses;

// routes
const auth = require('./routers/auth');
const users = require('./routers/users');
const quotes = require('./routers/quotes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  expressValidator({
    customValidators: {
      publicRoles(value) {
        return !!UserRoles[value];
      },
      quoteStatuses(value) {
        return !!QuoteStatuses[value];
      },
    },
    customSanitizers: {
      toUpperCase(value) {
        return value.toString().toUpperCase();
      },
    },
  })
);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ version: pjson.version, name: pjson.name });
});

const apiVersion = '/v1';

app.use('', router);
app.use(`${apiVersion}/users`, users);
app.use(`${apiVersion}/auth`, auth);
app.use(`${apiVersion}/quotes`, quotes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.status || 500).json(error);
  }

  return res.status(error.status || 500).json({ status: 'error', message: error.detail });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
