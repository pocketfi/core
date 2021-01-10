import config from '../config'
import User from '../models/User'
import app, {registerRoute, searchRoute, transactionRoute} from '../app'
import request from 'supertest'
import Transaction from '../models/Transaction'
import {TransactionType} from '../types/enums/TransactionType'
import async from 'async'
import {ITransaction} from '../types/interfaces/ITransaction'
import {ICategory} from '../types/interfaces/ICategory'

const http = request(app)

const user = new User({
  name: 'name',
  email: 'new@mail.com',
  password: 'password'
})

const transaction1 = {
  transactionType: TransactionType.EXPENSE,
  category: 'Smartphone',
  place: 'Life',
  price: '100.00',
  currency: 'DKK'
}

const transaction2 = {
  transactionType: TransactionType.EXPENSE,
  category: 'Food',
  place: 'Mac',
  price: 11,
  currency: 'USD',
  description: 'Good dinner'
}

let token: string

describe('search test', () => {

  beforeAll(done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .end((err, response) => {
        console.log(response.body, err)
        token = response.body.token

        var asyncTasks = []
        for (let i = 0; i < 10; i++) {
          asyncTasks.push((done: any) => {
            http
              .post(`${transactionRoute}new`)
              .set('x-auth-token', token)
              .send({transaction: i % 2 == 0 ? transaction1 : transaction2})
              .expect(200, done)
          })

        }

        async.parallel(asyncTasks, done)

      })
  })

  afterAll(done => {
    User.deleteMany({}).then(done)
    Transaction.deleteMany({}).then(done)
  })

  it('should use test database', () => {
    expect(config.MONGO_URI).toBe(process.env.MONGO_URI_TEST)
  })

  it('should search transactions by place', done => {
    http
      .post(`${searchRoute}transaction`)
      .set('x-auth-token', token)
      .send({searchText: transaction1.place})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        expect(res.body.length).toEqual(5)
        res.body.forEach((t: ITransaction) => {
          expect(t.place).toEqual(transaction1.place)
        })
        done()
      })
  })

  it('should search transactions by transaction type', done => {
    http
      .post(`${searchRoute}transaction`)
      .set('x-auth-token', token)
      .send({transactionType: transaction1.transactionType})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        expect(res.body.length).toEqual(10)
        res.body.forEach((t: ITransaction) => {
          expect(t.transactionType).toEqual(transaction1.transactionType)
        })
        done()
      })
  })

  it('should search transactions by searchText', done => {
    http
      .post(`${searchRoute}transaction`)
      .set('x-auth-token', token)
      .send({searchText: 'Li'})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        expect(res.body.length).toEqual(5)
        res.body.forEach((t: ITransaction) => {
          expect(t.place).toEqual(jasmine.stringMatching('Li'))
        })
        done()
      })
  })

  it('should search transactions by currency', done => {
    http
      .post(`${searchRoute}transaction`)
      .set('x-auth-token', token)
      .send({searchText: transaction2.currency})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        expect(res.body.length).toEqual(5)
        res.body.forEach((t: ITransaction) => {
          expect(t.currency).toEqual(transaction2.currency)
        })
        done()
      })
  })

  it('should search category by name', done => {
    http
      .post(`${searchRoute}category`)
      .set('x-auth-token', token)
      .send({category: transaction2.category})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        res.body.forEach((t: ICategory) => {
          expect(t.name).toEqual(transaction2.category)
        })
        done()
      })
  })

  it('should search places', done => {
    http
      .post(`${searchRoute}place`)
      .set('x-auth-token', token)
      .send({place: transaction2.place})
      .end((err, res) => {
        expect(res.body).toEqual(jasmine.any(Array))
        res.body.forEach((place: string) => {
          expect(place).toEqual(transaction2.place)
        })
        done()
      })
  })


})
