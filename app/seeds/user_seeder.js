exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del().then(function() {
    // Inserts seed entries
    return knex('users').insert([
      {
        name: 'dima',
        email: 'dmitry@intspirit.com',
        address: 'taganrog',
        password: 'foobar',
        role: 'CONTRACTOR',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'nikita',
        email: 'nikita@intspirit.com',
        address: 'taganrog',
        password: 'foobar',
        role: 'CONSUMER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  });
};
