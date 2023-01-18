const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const User = require('./model/user');


require('./db')().then(() => console.log('connected to online-test')).catch((err) => console.log(err));

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/users', [
    check('firstName').exists(),
    check('lastName').exists(),
    check('email').isEmail(),
    check('password').isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // create user
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) res.send(err);
        res.json(user);
    });
});

app.get('/users/search', [
    check('name').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const name = req.query.name;
    User.find({ $or: [{firstName: { $regex: name, $options: 'i' }}, {lastName: { $regex: name, $options: 'i' }}, {phone: { $regex: name, $options: 'i' }}] }, (err, users) => {
        if (err) res.send(err);
        res.json(users);
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;