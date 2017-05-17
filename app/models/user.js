'use strict';
/*
  {
    'id':                   'bigIncrements',
    'email':                'string',
    'password':             'text',
    'name':                 'text',
    'role':                 'string',
    'created_at':           'datetime',
    'updated_at':           'datetime',
    'last_login_at':        'datetime',
  }
*/

var bookshelf = require('../bookshelf');


var User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: ['created_at', 'updated_at'],
    hidden: ['password', 'role', 'created_at', 'updated_at', 'last_login_at'],
});

var Users = bookshelf.Collection.extend({
    model: User
});

exports.User = bookshelf.model('User', User);

exports.Users = bookshelf.collection('Users', Users);
