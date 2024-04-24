const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./routes');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./configs/passport-config')(passport);

// parse application/json
app.use(bodyParser.json());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); 

app.use(cors({ origin: 'http://localhost:5173', credentials: true}));

app.use(passport.initialize());

app.use('/api', routes);

// add a basic route
app.get('/', function (req, res) {
    res.json({ message: 'Express is up!' });
});

// start the app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
