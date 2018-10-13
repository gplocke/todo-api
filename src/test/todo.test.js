// Make sure we use the test environment if we're running tests
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../server');
let expect = chai.expect;

let mongoose = require("mongoose");
let User = require('../models/User');
let Todo = require('../models/Todo');

chai.use(chaiHttp);

let credentials = {
    "email": "test-todo@test.com",
    'password': "123@abc"
};
   
let userInfo = {
    "firstName": "Test",
    "lastName": "Todo",
    "email": "test-todo@test.com",
    "password": "123@abc"
};

describe('Get, Create, Update, and Delete Todos', () => {

    var userId = "";
    var token = "";

    after((done) => { 
        
        // remove the user
        User.findByIdAndDelete(userId, (err) => {
            done();
        });
    });

    beforeEach((done) => { 

        // Empty the collection of all the existing todos
        const removeTodos = Todo.deleteMany({}, (err) => {
            done();
        });
    });

    describe('GET /todo', () => {
        it('It should not allow us to get the todos because of missing authorization', (done) => {
            chai.request(app)
            .get('/todo')
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
    });

    describe('GET /todo/5bc10ba154148a3eeeeeeeee', () => {
        it('It should not allow us to get a todo because of missing authorization', (done) => {
            chai.request(app)
            .get('/todo/5bc10ba154148a3eeeeeeeee')
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
    });

    describe('POST /todo', () => {
        var todo = {
            text: "test todo"
        };
        it('It should not allow us to create a todo because of missing authorization', (done) => {
            chai.request(app)
            .post('/todo')
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
    });

    describe('PUT /todo/5bc10ba154148a3eeeeeeeee', () => {
        var todo = {
            text: "test todo"
        };
        it('It should not allow us to update a todo because of missing authorization', (done) => {
            chai.request(app)
            .put('/todo/5bc10ba154148a3eeeeeeeee')
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
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
                token = res.body.response.token;

                done();
            });
        });
    });

    describe('POST /todo', () => {
        it('It should not allow a todo to be created without a text field', (done) => {
            let todo = {
            }
            chai.request(app)
            .post('/todo')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
        });
    });

    describe('POST /todo', () => {
        it('It should create a new todo that is not complete', (done) => {
            let todo = {
                text: "This is a todo"
            }
            chai.request(app)
            .post('/todo')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.response).to.have.property("complete");
                expect(res.body.response.complete).to.be.false;
                done();
            });
        });
    });

    describe('POST /todo', () => {
        it('It should create a new todo that is not complete and then update it to be completed', (done) => {
            let todo = {
                text: "This is a todo"
            }
            chai.request(app)
            .post('/todo')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.response).to.have.property("complete");
                expect(res.body.response.complete).to.be.false;

                todo.complete = true
                chai.request(app)
                .put('/todo/' + res.body.response._id)
                .set('Authorization', token)
                .send(todo)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.have.property("complete");
                    expect(res.body.response.complete).to.be.true;
                    done();
                });
            });
        });
    });

    describe('GET /todo/5bc10ba154148a3eeeeeeeee', () => {
        it("It should not return a todo because it doesn't exist", (done) => {
            chai.request(app)
            .get('/todo/5bc10ba154148a3eeeeeeeee')
            .set('Authorization', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
    });

    describe('PUT /todo/5bc10ba154148a3eeeeeeeee', () => {
        let todo = {
            text: "This is a todo"
        }
        it("It should not update a todo because it doesn't exist", (done) => {
            chai.request(app)
            .put('/todo/5bc10ba154148a3eeeeeeeee')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
    });

    describe('DELETE /todo/5bc10ba154148a3eeeeeeeee', () => {
        it("It should not delete a todo because it doesn't exist", (done) => {
            chai.request(app)
            .delete('/todo/5bc10ba154148a3eeeeeeeee')
            .set('Authorization', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    
    describe('GET /todo', () => {
        it('It should GET all the todos', (done) => {
            chai.request(app)
            .get('/todo')
            .set('Authorization', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.response).to.be.an('array');
                expect(res.body.response.length).to.be.eql(0);
                done();
            });
        });
    });

    describe('POST /todo', () => {
        it('It should create a new todo and delete it', (done) => {
            let todo = {
                text: "This is a todo"
            }
            chai.request(app)
            .post('/todo')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.response).to.have.property("complete");
                expect(res.body.response).to.have.property("_id");

                let id = res.body.response._id;
                
                chai.request(app)
                .delete('/todo/' + id)
                .set('Authorization', token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
            });
        });
    });

    describe('POST /todo', () => {
        it('It should create a new todo and make sure it comes back with the list of todos', (done) => {
            let todo = {
                text: "This is a todo"
            }
            chai.request(app)
            .post('/todo')
            .set('Authorization', token)
            .send(todo)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.response).to.have.property("complete");
                expect(res.body.response).to.have.property("_id");
                
                chai.request(app)
                .get('/todo')
                .set('Authorization', token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response.length).to.be.eql(1);
                    done();
                });
            });
        });
    });
});