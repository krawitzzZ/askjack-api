const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) =>
  knex('users').del().then(() => {
    return knex('users').insert([
      {
        name: 'Contractor',
        email: 'contractor@test.com',
        address: 'New York',
        password: bcrypt.hashSync('foobar', 10),
        role: 'CONTRACTOR',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Consumer',
        email: 'consumer@test.com',
        address: 'Toronto',
        password: bcrypt.hashSync('foobar', 10),
        role: 'CONSUMER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  });
