const chalk = require('chalk');

const users = 'users';
const quotes = 'quotes';
const quotes_users = 'quotes_users';

console.log(chalk.green(`NODE_ENV: ${process.env.NODE_ENV}`));
console.log(chalk.green(`DATABASE_URL: ${process.env.DATABASE_URL}`));

const up = (knex, Promise) =>
  Promise.all([
    knex.schema
      .createTable(users, table => {
        table.increments('id').primary();
        table.text('name').notNull();
        table.string('email').notNull().unique();
        table.text('password').notNull();
        table.string('address');
        table.string('role').notNull();
        table.datetime('last_login_at');
        table.datetime('created_at').notNull();
        table.datetime('updated_at').notNull();
      })
      .then(() => {
        console.log(chalk.green(`Table ${users} + ' created.`));
      }),

    knex.schema
      .createTable(quotes, table => {
        table.increments('id').primary();
        table.string('name').notNull();
        table.string('labour').notNull();
        table.string('expenses').notNull();
        table.string('sales_tax').notNull();
        table.string('miscellaneous').notNull();
        table.string('created_by').notNull();
        table.datetime('created_at').notNull();
        table.datetime('updated_at').notNull();
      })
      .then(() => {
        console.log(chalk.green(`Table  ${quotes} created.`));
      }),

    knex.schema
      .createTable(quotes_users, table => {
        table.integer('user_id').references('users.id');
        table.integer('quote_id').references('quotes.id');
        table.string('status');
        table.datetime('created_at');
      })
      .then(() => {
        console.log(chalk.green(`Table ${quotes_users} created.`));
      }),
  ]);

const down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable(users).then(() => {
      console.log(chalk.green(`Table ${users} dropped.`));
    }),
    knex.schema.dropTable(quotes).then(() => {
      console.log(chalk.green(`Table ${quotes} dropped.`));
    }),
    knex.schema.dropTable(quotes_users).then(() => {
      console.log(chalk.green(`Table ${quotes_users} dropped.`));
    }),
  ]);

exports.up = up;
exports.down = down;
