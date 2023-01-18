const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
    email: String,
    phone: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;