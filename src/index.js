const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const jwtsecretkey = process.env.JWT_SECRET_KEY;
const jwtexpiration = process.env.JWT_EXPIRATION;

app.post('/login', (req, res) => {
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [req.body.username],
        function (err, user) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (user.length === 0) {
                return res
                    .status(401)
                    .json({ error: 'Incorrect username or password.' });
            }

            bcrypt.compare(
                req.body.password,
                user[0].password,
                function (err, isMatch) {
                    if (err) {
                        return res
                            .status(500)
                            .json({ error: 'Internal server error' });
                    }
                    if (!isMatch) {
                        return res
                            .status(401)
                            .json({ error: 'Incorrect username or password.' });
                    }

                    const token = jwt.sign({ id: user[0].id }, jwtsecretkey, {
                        expiresIn: jwtexpiration,
                    });
                    return res.json({ token });
                }
            );
        }
    );
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwtsecretkey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/profile', authenticateToken, (req, res) => {
    res.send('Welcome to your profile');
});

app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

// start the app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
