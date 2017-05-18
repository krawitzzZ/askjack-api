var express     = require('express')
  , bodyParser  = require('body-parser')
  , expressValidator = require('express-validator');

var UserRoles = require('./app/enums').UserRoles;
var QuoteStatuses = require('./app/enums').QuoteStatuses;

// routes
var users       = require('./routers/users');
var auth        = require('./routers/auth');
var quotes      = require('./routers/quotes');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
  customValidators: {
    publicRole: function(value) {
        return !!UserRoles[value];
    },
    quoteStatuses: function(value) {
        return !!QuoteStatuses[value];
    }
  }
}));

var router = express.Router();
router.get('/', function(req, res){
  var pjson = require('./package.json');
  res.json( { version: pjson.version, name: pjson.name } );
});
var apiVersion  = '/v1';

app.use('', router);
app.use(apiVersion + '/users', users);
app.use(apiVersion + '/auth', auth);
app.use(apiVersion + '/quotes', quotes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;