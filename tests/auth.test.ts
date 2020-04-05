import config from '../config'
import User from '../models/User';
import request from 'supertest'
import app, {authRoute, registerRoute} from "../app";

const http = request(app);

const user = new User({
	name: 'name',
	email: 'email@mail.com',
	password: 'password'
});

describe('authentication test', () => {

	beforeAll(done => {
		request(app)
			.post(registerRoute)
			.send({
				name: user.name,
				email: user.email,
				password: user.password
			})
			.expect(200, done);
	});

	afterAll(done => {
		User
			.deleteMany({})
			.then(done);
	});

	it('should use test database', () => {
		expect(config.MONGO_URI).toBe(process.env.MONGO_URI_TEST);
	});

	it('should auth existing user', done => {
		http
			.post(authRoute)
			.send({
				email: user.email,
				password: user.password
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.token).toEqual(jasmine.any(String));
				done();
			});
	});

	it('should not auth existing user due to invalid password', done => {
		http
			.post(authRoute)
			.send({
				email: user.email,
				password: ''
			})
			.expect(400, done);
	});

	it('should not auth nonexistent user', done => {
		http
			.post(authRoute)
			.send({
				email: '',
				password: user.password
			})
			.expect(400, done);
	});
});
