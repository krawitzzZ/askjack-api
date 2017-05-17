'use strict';

var chalk = require('chalk');

var users = 'users';

console.log(chalk.green("NODE_ENV: " + process.env.NODE_ENV));
console.log(chalk.green("DATABASE_URL: " + process.env.DATABASE_URL));

var up = function(knex, Promise) {
  return Promise.all([
        knex.schema.createTable(users, function (table) {
                       table.increments('id').primary();
                       table.text('name').notNull();
                       table.string('email').notNull();
                       table.text('password').notNull();
                       table.string('role').notNull();
                       table.datetime('last_login_at');
                       table.datetime('created_at').notNull();
                       table.datetime('updated_at').notNull();
                   })
                   .then(function () { console.log(chalk.green('Table ' + users + ' created.')); })
  ]);
}

var down = function (knex, Promise) {
  return Promise.all([
        knex.schema.dropTable(users)
                   .then(function () { console.log(chalk.green('Table ' + users + ' dropped.')); })
  ]);
}

exports.up = up;
exports.down = down;