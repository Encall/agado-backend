const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('./configs/db');
const signup = require('./routes/auth');

// parse application/json
app.use(bodyParser.json());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', signup);

// add a basic route

app.get('/', function (req, res) {
    res.json({ message: 'Express is up!' });
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// Use session middleware
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(function verify(username, password, cb) {
        db.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (user.length === 0) {
                    return cb(null, false, {
                        message: 'Incorrect username or password.',
                    });
                }

                // console.log(user);
                // console.log(password);
                // console.log(user[0].password);

                bcrypt.compare(
                    password,
                    user[0].password,
                    function (err, isMatch) {
                        if (err) {
                            return cb(err);
                        }
                        if (!isMatch) {
                            return cb(null, false, {
                                message: 'Incorrect username or password.',
                            });
                        }
                        return cb(null, user[0]);
                    }
                );
            }
        );
    })
);



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], function (err, users) {
        const user = users.find((u) => u.id === id);
        done(null, user);
    });
});

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true,
    })
);
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to your profile');
    } else {
        res.redirect('/login');
    }
});
app.get('/login', (req, res) => {
    res.send('Login page');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
app.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('This is a protected route');
});

// start the app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
