const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let salt = 10;
const User = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
    },
    address: {
        type: String,
        trim: true
    },
    country: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

User.pre('save', function(next){
    let user = this;
    if (user.password != undefined){
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err){
                next(err);
            }
            user.password = hash;
            next();
        });
    } else {
        console.error(user.password +''+ User.password)
    }
});

module.exports = mongoose.model('User', User);