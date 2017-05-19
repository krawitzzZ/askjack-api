const test = require('ava');
const request = require('supertest');
const app = require('../server');

const req = request(app);

test.cb('Should correctly register a new user: POST - /v1/auth/register', t => {
  t.plan(3);

  const testUser = {
    name: 'test',
    email: 'test@test.com',
    password: 'foobar',
    role: 'contractor',
  };

  req.post('/v1/auth/register').send(testUser).end((err, res) => {
    if (err) {
      t.fail();
      return;
    }

    const { user, token } = res.body;

    t.true(typeof token === 'string');
    t.is(user.name, testUser.name);
    t.is(user.email, testUser.email);
    t.end();
  });
});

test.cb(
  'Should throw an error when trying to register user with duplicate email: POST - /v1/auth/register',
  t => {
    t.plan(2);

    const testUser = {
      name: 'test1',
      email: 'test1@test.com',
      password: 'foobar',
      role: 'contractor',
    };

    req.post('/v1/auth/register').send(testUser).end(err => {
      if (err) {
        t.fail();
        return;
      }

      req.post('/v1/auth/register').send(testUser).end((error, res) => {
        if (error) {
          t.fail();
          return;
        }

        t.is(res.body.name, 'error');
        t.is(res.body.code, '23505');
        t.end();
      });
    });
  }
);

test.cb('Should correctly return a token: POST - /v1/auth/login', t => {
  t.plan(1);

  req
    .post('/v1/auth/login')
    .send({ email: 'contractor@test.com', password: 'foobar' })
    .end((err, res) => {
      if (err) {
        t.fail();
        return;
      }

      const token = res.body.token;

      t.true(typeof token === 'string');
      t.end();
    });
});
