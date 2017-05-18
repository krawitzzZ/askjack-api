const Knex = require('knex'), Bookshelf = require('bookshelf');

const nodeEnv = process.env.NODE_ENV || 'development';
const knexConfiguration = require('../knexfile')[nodeEnv];

const knex = Knex(knexConfiguration);

const bookshelf = Bookshelf(knex);
bookshelf.plugin('registry');
bookshelf.plugin('visibility');

module.exports = bookshelf;
