// Make sure we use the test environment if we're running tests
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../server');
let expect = chai.expect;

let mongoose = require("mongoose");
let User = require('../models/User');

chai.use(chaiHttp);

let credentials = {
    "email": "test-auth@test.com",
    'password': "123@abc"
};
   
let userInfo = {
    "firstName": "Test",
    "lastName": "Auth",
    "email": "test-auth@test.com",
    "password": "123@abc"
};

describe('Signup, login, and get JWT', () => {

    var userId = "";
    var token = "";

    after((done) => { 
        
        // remove the user
        User.findByIdAndDelete(userId, (err) => {
            done();
        });
    });

    describe('POST /auth/signup', () => {
        it('It should signup and check the JWT', (done) => {
            chai.request(app)
            .post('/auth/signup')
            .send(userInfo)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body.response).to.have.property('token'); 
                expect(res.body.response).to.have.property('user');
                
                userId = res.body.response.user._id;
                
                // follow up with login
                chai.request(app)
                .post('/auth/login')
                .send(credentials)
                .end((err, res) => {
                    console.log('this was run the login part');
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.have.property('token'); 
                  
                    token = res.body.response.token;
                  
                    chai.request(app)
                    .get('/user/me')
                    .set('Authorization', token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.response.email).to.equal(credentials.email);
                        expect(res.body.response).to.be.an('object');
                        done();
                    });
                });
                
            });
        });
    });
});