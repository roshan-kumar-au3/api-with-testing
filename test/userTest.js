const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../model/user');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    // Test the Post /users route
    describe('/POST users', () => {

        it('it should not POST a user without email field', (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                middleName: "Doe",
                phone: "08012345678",
                password: "12345678"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.be.a('array');
                    res.body.errors[0].should.have.property('param').eql('email');
                    done();
                });
            });
        

        it('it should POST a user ', (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                middleName: "",
                email: "johndoe@example.com",
                phone: "1234567890",
                password: "password"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('middleName');
                    res.body.should.have.property('email');
                    res.body.should.have.property('phone');
                    res.body.should.have.property('password');
                    done();
                });
        });


        it('it should not POST a user with short password', (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                middleName: "",
                email: "johndoe@example.com",
                phone: "1234567890",
                password: "pass"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.errors[0].should.have.property('param').eql('password');
                    done();
                });
        });

        it('it should not POST a user without firstName field', (done) => {
            const user = {
                lastName: "Doe",
                middleName: "",
                email: "johndoe@example.com",
                phone: "1234567890",
                password: "password"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.errors[0].should.have.property('param').eql('firstName');
                    done();
                });
        });

        it('it should not POST a user without lastName field', (done) => {
            const user = {
                firstName: "John",
                middleName: "",
                email: "johndoe@example.com",
                phone: "1234567890",
                password: "password"
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.errors[0].should.have.property('param').eql('lastName');
                    done();
                });
            });
    });


    // Test the GET /users/search route

    describe('/GET users/search', () => {

        it('it should not GET users without name query', (done) => {
            chai.request(server)
                .get('/users/search')
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.errors[0].should.have.property('param').eql('name');
                    done();
                });
        });

        it('it should GET all users matching the search query', (done) => {
            const user1 = new User({firstName: "John", lastName: "Doe", email: "johndoe@example.com", phone: "1234567890"});
            const user2 = new User({firstName: "Shane", lastName: "Doe", email: "janedoe@example.com", phone: "0987654321"});
            const user3 = new User({firstName: "Bob", lastName: "Smith", email: "bobsmith@example.com", phone: "5555555555"});
            user1.save();
            user2.save();
            user3.save();
            chai.request(server)
                .get('/users/search?name=Doe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    res.body[0].should.have.property('firstName').eql('John');
                    res.body[0].should.have.property('lastName').eql('Doe');
                    res.body[1].should.have.property('firstName').eql('Shane');
                    res.body[1].should.have.property('lastName').eql('Doe');
                    done();
                });
        });

        it('it should GET all users matching the search query', (done) => {
                const user1 = new User({firstName: "John", lastName: "Doe", email: "johndoe@example.com", phone: "1234567890"});
                const user2 = new User({firstName: "Shane", lastName: "test", email: "shanetest@example.com", phone: "0987654321"});
                const user3 = new User({firstName: "Bob", lastName: "Smith", email: "bobsmith@example.com", phone: "5555555555"});
                user1.save();
                user2.save();
                user3.save();
                chai.request(server)
                    .get('/users/search?name=0987654321')
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].should.have.property('firstName').eql('Shane');
                    res.body[0].should.have.property('phone').eql('0987654321');
                    done();
            });
        });

        it('it should return an empty array for non-existing user', (done) => {
            const user1 = new User({firstName: "John", lastName: "Doe", email: "johndoe@example.com", phone: "1234567890"});
            const user2 = new User({firstName: "Jane", lastName: "Doe", email: "janedoe@example.com", phone: "0987654321"});
            user1.save();
            user2.save();
            chai.request(server)
                .get('/users/search?name=Bob')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });



});
