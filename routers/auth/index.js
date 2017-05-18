'use strict';

var router  = require('express').Router()
    , User    = require('app/models/user').User
    , logger  = require('log4js').getLogger('[Auth]')
    , jwt    = require('jsonwebtoken');

router.post('/login', function (req, res, next) {
    req.assert('email', 'email is require').notEmpty();
    req.assert('email', 'valid email required').isEmail();
    req.assert('password', 'more then 6 characters required').len(6);

    req.getValidationResult()
        .then(function (result) {
            if (!result.isEmpty()) {
                throw new Error('There have been validation errors', {
                    errors: result.array()
                });
            }

            User.where('email', req.body.email).fetch().then(function (user) {
                if(! user) {
                    return res.status(422).json({ success: false, message: 'Authentication failed. User not found.' });
                }

                if(user.attributes.password != req.body.password) {

                    return res.status(401).json({ success: false, message: 'Authentication failed. Incorrect password.' });
                }

                var token = jwt.sign(user, process.env.SECRET, {
                    expiresIn: 86400
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }).catch(function (err) {
                logger.error('Create new User error: \n', err);
                next(err);
            });
        });
});

module.exports = router;