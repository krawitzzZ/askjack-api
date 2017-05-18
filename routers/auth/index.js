const router = require('express').Router();
const User = require('../../app/models/user').User;
const logger = require('log4js').getLogger('[Auth]');
const jwt = require('jsonwebtoken');
const mailService = require('../../app/services').mailService;

router.post('/register', (req, res, next) => {
  logger.info('Creating new user');

  req.assert('name', 'name is require').notEmpty();
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);
  req.assert('role', 'only create CONSUMER or CONTRACTOR is allowed').publicRole();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', {
          errors: result.array(),
        });
      }

      return new User(req.body).save();
    })
    .then(userModel => {
      logger.info('New User is created', userModel.get('id'));

      const token = jwt.sign(userModel, process.env.SECRET, {
        expiresIn: 86400,
      });

      const emailOptions = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Message',
        text: 'I hope this message gets buffered!',
      };
      mailService.sendMail(emailOptions);

      res.json({
        user: userModel,
        token,
      });
    })
    .catch(err => {
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

router.post('/login', (req, res, next) => {
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);

  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      throw new Error('There have been validation errors', {
        errors: result.array(),
      });
    }

    User.where('email', req.body.email)
      .fetch()
      .then(user => {
        if (!user) {
          return res
            .status(422)
            .json({ success: false, message: 'Authentication failed. User not found.' });
        }

        if (user.attributes.password !== req.body.password) {
          return res
            .status(401)
            .json({ success: false, message: 'Authentication failed. Incorrect password.' });
        }

        const token = jwt.sign(user, process.env.SECRET, {
          expiresIn: 86400,
        });

        return res.json({
          message: 'Enjoy your token!',
          token,
        });
      })
      .catch(err => {
        logger.error('Create new User error: \n', err);
        next(err);
      });
  });
});

module.exports = router;
