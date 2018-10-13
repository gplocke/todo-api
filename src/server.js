// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config/environment');
const express = require("express");
const bodyParser = require("body-parser");
const connectToMongo = require('./services/mongo');

var app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

require('./config/routes')(app);

try {

    connectToMongo();

    app.listen(config.port, function () {
        console.log('Server listening on %d, in the %s environment', config.port, config.env);
    });

} catch (err) {

    console.log(`Error starting server`);
    console.log(err);
    process.exit(1);
}

// Expose app
module.exports = app;