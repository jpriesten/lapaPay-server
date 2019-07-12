const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

let salt = 10;
const UserSchema = mongoose.Schema({
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
                throw new Error('Password should not be "password"!');
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
UserSchema.pre('save', function(next){
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
        console.error(user.password +''+ UserSchema.password)
    }
});

UserSchema.pre('remove', async function(next){
    const user = this
    // await Post.deleteMany({author: user._id})
    next()
})

UserSchema.methods.checkValidCredentials = async (email, password) => {
    try {
        let user = await User.findOne({email});
        console.log(user);
        if(!user){
            throw new Error('User ' + email +' not found');
        }
        
        let isMatch = bcrypt.compareSync(password.toString(), user.password.toString());

        if(!isMatch){
            throw new Error('Wrong email or password');
        }
        return {"error": false, "results": user};

    } catch (error) {
        return {"error": true, "results": error.message};
    }
    
}

// Create an authentication token for a user then saving the user
UserSchema.methods.newAuthToken = async function(){
    try {
        const user  = this;
        let token =  jwt.sign({ _id: user.id.toString() },'thisismyjwttoken', {expiresIn: "10h"});
        user.tokens = user.tokens.concat({ token });
        await user.save();
        return {"error": false, "results": token};
    } catch (error) {
        return {"error": true, "results": error};
    }
}

UserSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

const User = mongoose.model('User', UserSchema);
module.exports = User;