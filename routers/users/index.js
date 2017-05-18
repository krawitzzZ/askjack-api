'use strict';

var router  = require('express').Router()
  , util    = require('util')
  , User    = require('app/models/user').User
  , checkTokenMiddleware = require('middleware').checkTokenMiddleware
  , logger  = require('log4js').getLogger('[Users]')
  , mailService = require('app/services').mailService;

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
        throw new Error('There have been validation errors', {
          errors: result.array()
        });
      }

      return new User(req.body)
        .save();
    })
    .then(function (userModel) {
      logger.info('New User is created', userModel.get('id'));
        var emailOptions = {
          from: 'sender@example.com',
          to: 'recipient@example.com',
          subject: 'Message',
          text: 'I hope this message gets buffered!'
        };
        mailService.sendMail(emailOptions);
      res.sendStatus(200);
    })
    .catch(function(err){
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

router.get('/', checkTokenMiddleware,function (req, res) {
  User.collection().fetch().then(function (collection) {
    res.json(collection);
  });
});

module.exports = router;