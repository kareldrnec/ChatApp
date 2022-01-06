const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

describe('Login API', function() {
    it('should success if credential is valid', function(done) {
        request(app)
            .post('/users/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ email: 'karel.drnec@tul.cz', password: 'ahoj' })
            .expect(function(response) {
                expect(response).to.have.status(302)
                expect(response.body).to.be('Array')
                done();
            })
    });

    it('should create a new user', function(done) {
        done()
    })
})