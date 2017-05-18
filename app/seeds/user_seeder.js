const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) =>
  knex('users').del().then(() => {
    return knex('users').insert([
      {
        name: 'dima',
        email: 'dmitry@intspirit.com',
        address: 'taganrog',
        password: bcrypt.hashSync('foobar', 10),
        role: 'CONTRACTOR',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'nikita',
        email: 'nikita@intspirit.com',
        address: 'taganrog',
        password: bcrypt.hashSync('foobar', 10),
        role: 'CONSUMER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  });
