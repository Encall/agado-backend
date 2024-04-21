const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const routes = require('./routes');
const cors = require('cors');

// parse application/json
app.use(bodyParser.json());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', routes);

// add a basic route
app.get('/', function (req, res) {
    res.json({ message: 'Express is up!' });
});

// start the app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
