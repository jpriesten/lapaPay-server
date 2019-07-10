const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email '+ value + ' is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!');
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!');
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain "password"!');
            } 
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Salt and hash passwords before saving to db
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

// Create an authentication token for a user then saving the user
User.methods.newAuthToken = async function(){
    try {
        const user  = this;
        const token =  jwt.sign({ _id: user.id.toString() },'thisismyjwttoken', {expiresIn: "10h"});
        user.tokens = user.tokens.concat({ token });
        await user.save();
        return token;
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('User', User);