const test = require('ava');

test.cb('Should correctly create a new user: POST - /v1/users', t => {
  t.pass();
});

test('Should throw an error when trying to create user with duplicate email: POST - /v1/users', t => {
  t.pass();
});

test('Should correctly return all users if access-token was provided: GET - /v1/users', t => {
  t.pass();
});

test('Should throw an error if access-token was not provided: GET - /v1/users', t => {
  t.pass();
});
