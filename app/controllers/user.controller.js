const User = require('../models/user.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // TODO: Validate the request
    // Create a user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // Save user to database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
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

};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {

};