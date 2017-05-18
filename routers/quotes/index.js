const router = require('express').Router();
const Quote = require('../../app/models/quote').Quote;
const User = require('../../app/models/user').User;
const checkTokenMiddleware = require('../../middleware').checkTokenMiddleware;
const logger = require('log4js').getLogger('[Quotes]');

router.use(checkTokenMiddleware);

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
      res.status(201).json({ quote: quoteModel });
    })
    .catch(err => {
      logger.error('Create new Quote error: \n', err);
      next(err);
    });
});

router.post('/offer', (req, res, next) => {
  req.assert('quote_id', 'quote ID is require').notEmpty();
  req.assert('user_id', 'user ID is require').notEmpty();

  req
    .getValidationResult()
    .then(result => {
      if (!result.isEmpty()) {
        throw new Error('There have been validation errors', { errors: result.array() });
      }

      new Quote({ id: req.body.quote_id })
        .users()
        .attach({
          user_id: req.body.user_id,
          created_at: new Date(),
        })
        .then(reslt => {
          res.json(reslt);
        });
    })
    .catch(err => {
      logger.error('Create new User error: \n', err);
      next(err);
    });
});

// offered to me
router.get('/offered', (req, res) => {
  const userId = req.decoded.attributes.id;
  new User({ id: userId }).quotes().fetch().then(result => {
    res.json(result || []);
  });
});

// I offered
router.get('/offers', (req, res) => {
  const userId = req.decoded.attributes.id;
  const status = req.query.status ? req.query.status.toUpperCase() : null;
  new Quote({ created_by: userId })
    .fetch({
      withRelated: [
        {
          users(qb) {
            return qb.where('status', status || null); // all statuses instead of one
          },
        },
      ],
    })
    .then(result => {
      res.json(result || []);
    });
});

router.put('/:id', (req, res) => {
  req.assert('status', 'status can be only ACCEPTED or REJECTED').quoteStatuses();

  const userId = req.decoded.attributes.id;
  const quoteId = req.params.id;
  const status = req.body.status.toUpperCase();

  new User({ id: userId })
    .quotes()
    .updatePivot({ status }, null, { whereIn: ['quote_id', [quoteId]] })
    .then(result => {
      res.json(result);
    });
});

router.get('/', (req, res) => {
  Quote.collection().fetch({ withRelated: ['users'] }).then(collection => {
    res.json(collection);
  });
});

module.exports = router;
