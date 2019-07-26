module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    // const visa = require('../controllers/visa.controller');
    const authenticate = require('../middlewares/authenticator.middleware');

    // app.post('/validate-account', visa.validateAccount);

    // Create a new User
    app.post('/users/create', users.create);

    // Login a user
    app.post('/users/login', users.login);

    // Login a user out
    app.post('/users/logout', authenticate, users.logout);

    // Retrieve all Users
    app.get('/users', authenticate, users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOne);

    // Update aUser with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);
}