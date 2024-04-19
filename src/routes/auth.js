const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../configs/db');

const router = express.Router();

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], function (err, users) {
        if (err) {
            return res.status(500).json({ message: 'Error occurred during signup.' });
        }

        if (users.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash the password
        bcrypt.hash(password, 10, function(err, hashedPassword) {
            if (err) {
                return res.status(500).json({ message: 'Error occurred during signup.' });
            }

            // Insert the new user into the database
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err, result) {
                if (err) {
                    return res.status(500).json({ message: 'Error occurred during signup.' });
                }

                res.status(200).json({ message: 'Signup successful.' });
            });
        });
    });
});

module.exports = router;