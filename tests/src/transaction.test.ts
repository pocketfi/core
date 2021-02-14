import User from '../../models/User'
import app, {registerRoute, transactionRoute} from '../../app'
import request from 'supertest'
import Transaction from '../../models/Transaction'
import {TransactionType} from '../../types/enums/TransactionType'
import Category from '../../models/Category'

const http = request(app)

const user = new User({
  name: 'name',
  email: 'new@mail.com',
  password: 'password'
})

const transaction = {
  transactionType: TransactionType.EXPENSE,
  category: 'Food',
  place: 'KFC',
  price: 10,
  currency: 'USD'
}

const newTransaction = {
  transactionType: TransactionType.EXPENSE,
  category: 'New',
  place: 'Mac',
  price: 11,
  currency: 'USD',
  description: 'Good dinner'
}

let token: string

describe('transactions test', () => {

  beforeAll(done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .end((err, response) => {
        token = response.body.token
        done()
      })
  })

  afterAll(done => {
    User.deleteMany({}).then(done)
  })

  afterEach(done => {
    Transaction.deleteMany({}).then(done)
    Category.deleteMany({}).then(done)
  })

  it('should create new transaction', done => {
    http
      .post(transactionRoute + '/new')
      .set('x-auth-token', token)
      .send({transaction})
      .expect(200)
      .end((err, res) => {
        expect(res.body.id).toEqual(jasmine.any(String))
        expect(res.body.transactionType).toEqual(transaction.transactionType)
        expect(res.body.currency).toEqual(transaction.currency)
        expect(res.body.category.name).toEqual(transaction.category)
        expect(res.body.place).toEqual(transaction.place)
        expect(res.body.price).toEqual(transaction.price)
        done()
      })
  })

  it('should not create new transaction without token', done => {
    http
      .post(transactionRoute + '/new')
      .send({transaction})
      .expect(401, done)
  })

  it('should get user transactions', done => {
    http
      .get(transactionRoute + '/get')
      .set('x-auth-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        done()
      })
  })

  it('should not get transactions without token', done => {
    http
      .get(transactionRoute + '/get')
      .expect(401, done)
  })

  it('should update transaction', done => {
    http
      .post(transactionRoute + '/new')
      .set('x-auth-token', token)
      .send({transaction})
      .end((err, res) => {
        http
          .post(transactionRoute + '/update')
          .set('x-auth-token', token)
          .send({
            transaction: {
              id: res.body.id,
              category: {
                id: res.body.category.id,
                name: newTransaction.category,
                user: res.body.user
              },
              place: newTransaction.place,
              price: newTransaction.price,
              description: newTransaction.description
            }
          }).expect(200)
          .end((err, res) => {
            expect(res.body.id).toEqual(res.body.id)
            expect(res.body.category.name).toEqual(newTransaction.category)
            expect(res.body.place).toEqual(newTransaction.place)
            expect(res.body.price).toEqual(newTransaction.price)
            expect(res.body.description).toEqual(newTransaction.description)
            done()
          })
      })
  })

  it('should not update transaction without token', done => {
    http
      .post(transactionRoute + '/new')
      .set('x-auth-token', token)
      .send({transaction})
      .end((err, res) => {
        http
          .post(transactionRoute + '/update')
          .send({
            transaction: {
              id: res.body.id,
              category: {
                id: res.body.category.id,
                name: newTransaction.category,
                user: res.body.user
              },
              place: newTransaction.place,
              price: newTransaction.price,
              description: newTransaction.description
            }
          }).expect(401, done)
      })
  })

  it('should delete transaction', done => {
    http
      .post(transactionRoute + '/new')
      .set('x-auth-token', token)
      .send({transaction})
      .end((err, res) => {
        http
          .delete(transactionRoute + '/delete/' + res.body.id)
          .set('x-auth-token', token)
          .expect(200)
          .end((error, response) => {
            expect(response.body.id).toEqual(res.body.id)
            done()
          })
      })
  })

  it('should not delete transaction without token', done => {
    http
      .post(transactionRoute + '/new')
      .set('x-auth-token', token)
      .send({transaction})
      .end((err, res) => {
        http
          .delete(transactionRoute + '/delete/' + res.body.id)
          .expect(401, done)
      })
  })

})
