import config from '../config'
import User from '../models/User';
import app, {registerRoute} from "../app";
import request from 'supertest'
import Transaction from "../models/Transaction";
import {TransactionType} from "../types/enums/TransactionType";

const http = request(app);

const user = new User({
  name: 'name',
  email: 'new@mail.com',
  password: 'password'
});

const transaction = new Transaction({
  transactionType: TransactionType.EXPENSE,
  category: 'Food',
  place: 'KFC',
  price: 10,
  currency: 'USD'
})

const newTransaction = new Transaction({
  transactionType: TransactionType.EXPENSE,
  category: 'Food',
  place: 'Mac',
  price: 11,
  currency: 'USD',
  description: 'Good dinner'
})
let token: string;

describe('transactions test', () => {

  beforeAll(done => {
    request(app)
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .end((err, response) => {
        token = response.body.token;
        done();
      });
  });

  afterAll(done => {
    User.deleteMany({}).then(done)
    Transaction.deleteMany({}).then(done)
  });

  it('should use test database', () => {
    expect(config.MONGO_URI).toBe(process.env.MONGO_URI_TEST);
  });

  it('should create new transaction', done => {
    http
      .post('/api/transaction/new')
      .set('x-auth-token', token)
      .send({transaction})
      .expect(200, done)

  });

  it('should not create new transaction without token', done => {
    http
      .post('/api/transaction/new')
      .send({transaction})
      .expect(401, done)

  });

  it('should get user transactions', done => {
    http
      .get('/api/transaction/get')
      .set('x-auth-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array));
        done();
      });

  });

  it('should not get transactions without token', done => {
    http
      .get('/api/transaction/get')
      .expect(401, done)

  });

})