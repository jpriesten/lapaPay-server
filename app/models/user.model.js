const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: Number,
    address: String,
    country: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);