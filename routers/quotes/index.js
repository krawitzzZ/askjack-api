'use strict';

var router  = require('express').Router()
  , util    = require('util')
  , Quote   = require('app/models/quote').Quote
  , User    = require('app/models/user').User
  , checkTokenMiddleware = require('middleware').checkTokenMiddleware
  , logger  = require('log4js').getLogger('[Quotes]');

router.use(checkTokenMiddleware);

router.post('/', function (req, res, next) {
  logger.info('Creating new quote');
  
  req.assert('name', 'name is require').notEmpty();
  req.assert('labour', 'email is require').notEmpty();
  req.assert('expenses', 'email is require').notEmpty();
  req.assert('sales_tax', 'email is require').notEmpty();
  req.assert('miscellaneous', 'email is require').notEmpty();

  req.getValidationResult()
    .then(function(result) {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', {
          errors: result.array()
        });
      }

      req.body.created_by = req.decoded.attributes.id;

      return new Quote(req.body)
        .save();
    })
    .then(function (quoteModel) {
      logger.info('New User is created', quoteModel.get('id'));
      res.sendStatus(200);
    })
    .catch(function(err){
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

router.post('/offer', function (req, res, next) {
  req.assert('quote_id', 'quote ID is require').notEmpty();
  req.assert('user_id', 'user ID is require').notEmpty();

  req.getValidationResult()
      .then(function (result) {
        if (!result.isEmpty()) {
          throw new Error('There have been validation errors', {
            errors: result.array()
          });
        }

        Promise.all([
          new Quote({id: req.body.quote_id}).users().attach({
            user_id: req.body.user_id,
            created_at: new Date(),
          })
        ])
          .then(function (result) {
            res.json(result);
          });
      })
      .catch(function(err){
        logger.error('Create new User error: \n', err);
        next(err);
      });
});

//offered to me
router.get('/offered', function (req, res) {
  var userId = req.decoded.attributes.id;
  new User({id: userId}).quotes().fetch().then(function (result) {
    res.json(result);
  });
});

//I offered
router.get('/offers', function (req, res) {
  var userId = req.decoded.attributes.id;
  var status = req.query.status.toUpperCase();
  new Quote({ created_by: userId }).fetch({ withRelated: [{
    'users': function (qb) {
      return qb.where('status', status ? status : null)
    }
  }] }).then(function (result) {
    res.json(result);
  });
});

router.put('/:id', function (req, res) {
  req.assert('status', 'status can be only ACCEPTED or REJECTED').quoteStatuses();

  var userId = req.decoded.attributes.id;
  var quoteId = req.params.id;
  var status = req.body.status.toUpperCase();

  new User({ id: userId }).quotes().updatePivot({
    status: status
  }, null, {whereIn: ['quote_id', [quoteId]]})
      .then(function (result) {
        res.json(result);
      });
});

router.get('/',function (req, res) {
  Quote.collection().fetch({ withRelated: ['users'] }).then(function (collection) {
    res.json(collection);
  });
});

module.exports = router;