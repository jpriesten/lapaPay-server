const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const logger = require('./app/logging/logs');
const cors = require('cors');

// create express app
const app = express();
const port  =  process.env.PORT || 3000

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(logger.requestLogger);

// Enable CORS globally
const corsOptions = {
    // origin: ['http://localhost:8100', 'http://192.168.8.108:8100', 'http://0.0.0.0:8100', 'https://labapay-client.firebaseapp.com'],
    origin: '*', 
    allowedHeaders: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,Origin,Accept,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Access-Control-Allow-Origin',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}
app.use(cors(corsOptions));

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to labapay server application."});
});

// User routes
require ('./app/routes/user.routes') (app);
// Transaction routes
require ('./app/routes/visa.routes') (app);

app.use(logger.errorLogger);
// listen for requests
app.listen(port, () => {
    console.log("CORS-enabled Server is listening on port", port);
});