const User = require('../models/user.model.js');

// Create and Save a new User
exports.create = (req, res) => {

    // Get user information from request
    const user = new User(req.body);

    User.init().then(async () => {
        try {
            // Save the user to db, generate a token and send it back as response
            const token = await user.newAuthToken();
            res.status(201).send({token});
        } catch (error) {
            res.status(400).send(error);
        }
    }).catch(error => {
        res.status(400).send(error);
    });
    
};

// Login a user
exports.login = async (req, res) => {
    // Get user information from request
    const user = new User(req.body);
    try {
        const authenticatedUser  = await user.checkValidCredentials(req.body.email, req.body.password);
        if(authenticatedUser.status){
            res.status(400).send({"error": authenticatedUser.error});
        } else {
            const token = await authenticatedUser.newAuthToken();
            console.log(req.body);
            res.send({ "user": authenticatedUser, token});
        }
        
    } catch(error) {
        res.status(400).send({error});
    }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Note content can not be empty"
    //     });
    // }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};