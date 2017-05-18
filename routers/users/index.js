const router = require('express').Router();
const User = require('../../app/models/user').User;
const checkTokenMiddleware = require('../../middleware').checkTokenMiddleware;
const logger = require('log4js').getLogger('[Users]');

router.post('/', (req, res, next) => {
  req.sanitizeBody('role').toUpperCase();
  req.assert('name', 'name is require').notEmpty();
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);
  req.assert('role', 'only create CONSUMER or CONTRACTOR is allowed').publicRoles();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', { errors: result.array() });
      }

      return new User(req.body).save();
    })
    .then(userModel => {
      logger.info('New User is created', userModel.get('id'));

      res.status(201).json({ user: userModel });
    })
    .catch(err => {
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

router.get('/', checkTokenMiddleware, (req, res) => {
  User.collection().fetch().then(collection => {
    res.json(collection);
  });
});

module.exports = router;
