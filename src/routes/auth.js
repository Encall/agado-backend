const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');

const router = express.Router();

const jwtsecretkey = process.env.JWT_SECRET_KEY;
const jwtexpiration = process.env.JWT_EXPIRATION;

router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required.' });
    }

    // Check if user already exists
    db.query(
        'SELECT * FROM userAccount WHERE email = ?',
        [email],
        function (err, users) {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Error occurred during signup.' });
            }

            if (users.length > 0) {
                return res
                    .status(400)
                    .json({ message: 'Email already exists.' });
            }

            // Hash the password
            bcrypt.hash(password, 10, function (err, hashedPassword) {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Error occurred during signup.' });
                }

                // Insert the new user into the database
                db.query(
                    'INSERT INTO userAccount (email, password) VALUES (?, ?)',
                    [email, hashedPassword],
                    function (err, result) {
                        if (err) {
                            return res
                                .status(500)
                                .json({
                                    message: 'Error occurred during signup.',
                                });
                        }

                        // Create a JWT
                        const token = jwt.sign(
                            { email: email },
                            jwtsecretkey,
                            { expiresIn: jwtexpiration }
                        );

                        res.status(200).json({
                            message: 'Signup successful.',
                            token: token,
                        });
                    }
                );
            });
        }
    );
});

module.exports = router;
