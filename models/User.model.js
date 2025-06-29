const mongoose = require('mongoose');

const user = new mongoose.Schema({
    login: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: true},
    phone: {type: String, required: false, default: ''},
})

module.exports = mongoose.model('User', user);