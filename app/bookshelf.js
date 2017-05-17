'use strict';

var Knex = require('knex')
  , Bookshelf = require('bookshelf');

var nodeEnv = process.env.NODE_ENV || 'development';
var knexConfiguration = require('../knexfile')[nodeEnv];

var knex = Knex(knexConfiguration);

var bookshelf = Bookshelf(knex);
bookshelf.plugin('registry');
bookshelf.plugin('visibility');

module.exports = bookshelf;