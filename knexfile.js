module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'askjack'
    },
    pool: {
        min: 0,
        max: 1
    },
    debug: false,
    migrations: {
        tableName: 'knex_migrations',
        directory: './app/migrations'
    },
    seeds: {
      directory: './app/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 0,
        max: 1
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './app/migrations'
    },
    seeds: {
      directory: './app/seeds'
    }
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'askjack'
    },
    pool: {
        min: 0, max: 1
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './app/migrations'
    },
    seeds: {
      directory: './app/seeds'
    }
  }
};