'use strict';

var router  = require('express').Router()
  , util    = require('util')
  , User    = require('app/models/user').User
  , logger  = require('log4js').getLogger('[Users]');

router.post('/', function (req, res, next) {
  logger.info('Creating new user');
  
  req.assert('name', 'name is require').notEmpty();
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);
  req.assert('role', 'only create CONSUMER or CONTRACTOR is allowed').publicRole();

  req.getValidationResult()
    .then(function(result) {
      if (!result.isEmpty()) {
        throw 'There have been validation errors: ' + util.inspect(result.array());
      }

      return new User(req.body)
        .save();
    })
    .then(function (userModel) {
      logger.info('New User is created', userModel.get('id'));
      res.sendStatus(200);
    })
    .catch(function(err){
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

module.exports = router;