'use strict';
/*
 {
 'id':                  'bigIncrements',
 'name':                'string',
 'labour':              'string',
 'expenses':            'string',
 'sales_tax':           'string',
 'miscellaneous':       'string',
 'created_at':          'datetime',
 'updated_at':          'datetime',
 }
 */


var bookshelf = require('../bookshelf');
require('./user');

var Quote = bookshelf.Model.extend({
    tableName: 'quotes',
    hasTimestamps: ['created_at', 'updated_at'],
    hidden: ['created_at', 'updated_at'],
    users: function() {
        return this.belongsToMany('User').withPivot(['created_at', 'status']);
    }
});

var Quotes = bookshelf.Collection.extend({
    model: Quote
});

exports.Quote = bookshelf.model('Quote', Quote);

exports.Quotes = bookshelf.collection('Quotes', Quotes);
