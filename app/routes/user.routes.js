module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const authenticate = require('../middlewares/authenticator.middleware');

    // Create a new User
    app.post('/users/create', users.create);

    // Login a user
    app.post('/users/login', users.login);

    // Retrieve all Users
    app.get('/users', authenticate, users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOne);

    // Update aUser with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);
}