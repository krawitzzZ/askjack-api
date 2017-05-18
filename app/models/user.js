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

const bookshelf = require('../bookshelf');
require('./quote');

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: ['created_at', 'updated_at'],
  hidden: ['password', 'role', 'created_at', 'updated_at', 'last_login_at'],
  quotes: function() {
    return this.belongsToMany('Quote').withPivot(['created_at', 'status']);
  },
});

const Users = bookshelf.Collection.extend({
  model: User,
});

exports.User = bookshelf.model('User', User);

exports.Users = bookshelf.collection('Users', Users);
