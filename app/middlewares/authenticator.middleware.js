const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').trim();
        
        const decoded  = jwt.verify(token, 'thisismyjwttoken');
       
        const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token});

        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({error:'Please authenticate!'});
    }
}

module.exports = auth;