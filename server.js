/**
 * Created by khancode on 5/22/15.
 */

// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql = require('mysql');
// RESTful routers
var userRouter = require('./user-router');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Allow same-origin-access
// Add headers
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:63342");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(allowCrossDomain);

var port = process.env.PORT || 8080; // use 80 for deployment   // set our port

// SETUP DATABASE CONNECTION
// =============================================================================
var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'C0D3developer',
    database: 'khancode'
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/test', function(req, res) {
    res.json({ message: 'lawl'});
});

router.post('/', function(req, res) {
    res.json({ message: 'sup bro!'});
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use('/user', userRouter(express, pool));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);