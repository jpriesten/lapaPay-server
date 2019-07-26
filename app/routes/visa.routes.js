module.exports = (app) => {
    const visa = require('../controllers/visa.controller');
    const authenticate = require('../middlewares/authenticator.middleware');

    // Validate a VISA account
    app.post('/transaction/validate-account', visa.validateAccount);
}