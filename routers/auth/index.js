const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../../app/models/user').User;
const logger = require('log4js').getLogger('[Auth]');
const jwt = require('jsonwebtoken');
const mailService = require('../../app/services').mailService;

/**
 * Register new user
 * @method POST
 * @param {object} body - new user data
 * @param {string} body.name - required
 * @param {string} body.email - required
 * @param {string} body.password - required
 * @param {string: enumerable of CONSUMER/CONTRACTOR} body.role - required
 * @param {string} body.address - optional
 *
 * @return {object} registered user, access-token for authentication
 */
router.post('/register', (req, res, next) => {
  req.sanitizeBody('role').toUpperCase();
  req.assert('name', 'name is require').notEmpty();
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);
  req.assert('role', 'only register CONSUMER or CONTRACTOR is allowed').publicRoles();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', { errors: result.array() });
      }

      return new User(req.body).save();
    })
    .then(userModel => {
      logger.info('New User is registered with id: ', userModel.get('id'));

      const token = jwt.sign(userModel, process.env.SECRET, { expiresIn: 86400 });
      const emailOptions = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Message',
        text: 'I hope this message gets read!',
      };

      mailService.sendMail(emailOptions);

      res.json({
        user: userModel,
        token,
      });
    })
    .catch(err => {
      logger.error('Register new User error:\n', err);
      next(err);
    });
});

/**
 * Login. Get access-token
 * @method POST
 * @param {object} body - data for login user
 * @param {string} body.email - required
 * @param {string} body.password - required
 *
 * @return {object} access-token for authentication
 */
router.post('/login', (req, res, next) => {
  req.assert('email', 'email is require').notEmpty();
  req.assert('email', 'valid email required').isEmail();
  req.assert('password', 'more then 6 characters required').len(6);

  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      throw new Error('There have been validation errors', { errors: result.array() });
    }

    User.where('email', req.body.email)
      .fetch()
      .then(user => {
        if (!user) {
          return res.status(422).json({ message: 'Authentication failed. User not found.' });
        }

        return bcrypt.compare(req.body.password, user.get('password')).then(verificationSuccess => {
          if (!verificationSuccess) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
          }

          const token = jwt.sign(user, process.env.SECRET, { expiresIn: 86400 });

          return res.json({ token });
        });
      })
      .catch(err => {
        logger.error('Login User error: \n', err);
        next(err);
      });
  });
});

module.exports = router;
