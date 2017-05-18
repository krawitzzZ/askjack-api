/**
 * {
 *    'id':            'bigIncrements',
 *    'email':         'string',
 *    'password':      'text',
 *    'name':          'text',
 *    'role':          'string',
 *    'created_at':    'datetime',
 *    'updated_at':    'datetime',
 *    'last_login_at': 'datetime',
 * }
 **/
const bcrypt = require('bcrypt');
const bookshelf = require('../bookshelf');
require('./quote');

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: ['created_at', 'updated_at'],
  hidden: ['password', 'role', 'created_at', 'updated_at', 'last_login_at'],
  virtuals: {
    password: {
      get() {
        return this.get('password');
      },
      set(password) {
        bcrypt.hash(password, 9).then(hashedPassword => {
          this.set('password', hashedPassword);
        });
      },
    },
  },
  quotes() {
    return this.belongsToMany('Quote').withPivot(['created_at', 'status']);
  },
});

const Users = bookshelf.Collection.extend({
  model: User,
});

exports.User = bookshelf.model('User', User);
exports.Users = bookshelf.collection('Users', Users);
