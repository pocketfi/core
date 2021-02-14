import config from '../config'
import User from '../models/User'
import request from 'supertest'
import app, {registerRoute} from '../app'

const http = request(app)

const user = new User({
  name: 'name',
  email: 'email@mail.com',
  password: 'password'
})

describe('registration test', () => {

  beforeAll(done => {
    done()
  })

  afterEach(done => {
    User
      .deleteMany({})
      .then(done)
  })

  it('should register user', done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .expect(200)
      .end((err, res) => {
        const {id, password, email, name} = res.body.user

        expect(res.body.token).toEqual(jasmine.any(String))
        expect(name).toEqual(user.name)
        expect(email).toEqual(user.email)
        expect(password).toBeUndefined()

        done()
      })
  })

  it('should not register user with already used email', done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .end(() => {
        http
          .post(registerRoute)
          .send({
            email: user.email,
            password: ''
          })
          .expect(400, done)
      })
  })

  it('should not register user without name', done => {
    http
      .post(registerRoute)
      .send({
        email: user.email,
        password: user.password
      })
      .expect(400, done)
  })

  it('should not register user without email', done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        password: user.password
      })
      .expect(400, done)
  })

  it('should not register user without password', done => {
    http
      .post(registerRoute)
      .send({
        name: user.name,
        email: user.email
      })
      .expect(400, done)
  })

  it('should not register not provided user', done => {
    http
      .post(registerRoute)
      .send(null)
      .expect(400, done)
  })
})
