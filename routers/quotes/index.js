const router = require('express').Router();
const Quote = require('../../app/models/quote').Quote;
const User = require('../../app/models/user').User;
const checkTokenMiddleware = require('../../middleware').checkTokenMiddleware;
const logger = require('log4js').getLogger('[Quotes]');

/**
 * Authentication middleware
 */
router.use(checkTokenMiddleware);

/**
 * Create new quote
 * @method POST
 * @param {object} body - new quote data
 * @param {string} body.name - required
 * @param {string} body.labour - required
 * @param {string} body.expenses - required
 * @param {string} body.sales_tax - required
 * @param {string} body.miscellaneous - required
 *
 * @return {object} created quote
 */
router.post('/', (req, res, next) => {
  req.assert('name', 'name is require').notEmpty();
  req.assert('labour', 'labour is require').notEmpty();
  req.assert('expenses', 'expenses is require').notEmpty();
  req.assert('sales_tax', 'sales_tax is require').notEmpty();
  req.assert('miscellaneous', 'miscellaneous is require').notEmpty();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', { errors: result.array() });
      }

      const quoteData = req.body;
      quoteData.created_by = req.decoded.attributes.id;

      return new Quote(quoteData).save();
    })
    .then(quoteModel => {
      logger.info('New Quote is created with id: ', quoteModel.get('id'));
      res.status(201).json(quoteModel);
    })
    .catch(err => {
      logger.error('Create new Quote error: \n', err);
      next(err);
    });
});

/**
 * Offer quote to the consumer
 * @method POST
 * @param {object} body - data for the offer
 * @param {number|string} body.user_id - required
 * @param {number|string} body.quote_id - required
 *
 * @return {object} status code
 */
router.post('/offer', (req, res, next) => {
  req.assert('quote_id', 'quote ID is require').notEmpty();
  req.assert('user_id', 'user ID is require').notEmpty();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', { errors: result.array() });
      }

      Quote.forge({ id: req.body.quote_id })
        .users()
        .attach({
          user_id: req.body.user_id,
          created_at: new Date(),
        })
        .then(() => {
          res.sendStatus(200);
        });
    })
    .catch(err => {
      logger.error('Offer quote to user error: \n', err);
      next(err);
    });
});

/**
 * Get quotes offered to the user
 * @method GET
 *
 * @return {aray} array of quotes with pivot data
 */
router.get('/offered', (req, res, next) => {
  const userId = req.decoded.attributes.id;
  User.forge({ id: userId })
    .quotes()
    .fetch()
    .then(result => {
      res.json(result || []);
    })
    .catch(err => {
      logger.error('Get offered to user quotes error: \n', err);
      next(err);
    });
});

/**
 * Get quotes user offered to other users
 * @method GET
 * @param {object} query - request's qeurystring data
 * @param {string enumerable of ACCEPTED/REJECTED} query.status - optional
 *
 * @return {aray} array of the quotes with pivot data
 */
router.get('/offers', (req, res, next) => {
  const userId = req.decoded.attributes.id;
  const status = req.query.status ? req.query.status.toUpperCase() : null;
  Quote.forge({ created_by: userId })
    .fetchAll({
      withRelated: {
        users(qb) {
          return qb.where('status', status);
        },
      },
    })
    .then(result => {
      res.json(result.toJSON().filter(quote => !!quote.users.length));
    })
    .catch(err => {
      logger.error('Get offered by users quotes error:\n', err);
      next(err);
    });
});

/**
 * Accept/reject offered quote
 * @method PUT
 * @param {object} params - route params object
 * @param {string} params.id - quote to update id
 * @param {object} body - data for the offer
 * @param {string enumerable of ACCEPTED/REJECTED} body.status - required
 *
 * @return {object} status code
 */
router.put('/:id', (req, res, next) => {
  req.assert('status', 'status can be only ACCEPTED or REJECTED').quoteStatuses();

  const userId = req.decoded.attributes.id;
  const quoteId = req.params.id;
  const status = req.body.status.toUpperCase();

  User.forge({ id: userId })
    .quotes()
    .updatePivot(
      { status },
      {
        query: {
          where: { quote_id: quoteId },
        },
      }
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      logger.error('Accept/reject quote error:\n', err);
      next(err);
    });
});

/**
 * Get all quotes
 * @method GET
 *
 * @return {array} List of quotes with related users
 */
router.get('/', (req, res, next) => {
  Quote.collection()
    .fetch({ withRelated: ['users'] })
    .then(collection => {
      res.json(collection);
    })
    .catch(err => {
      logger.error('Get all quotes error:\n', err);
      next(err);
    });
});

module.exports = router;
