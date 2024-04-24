require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');

const opts = require('../configs/cookie-config');
const jwtsecretkey = process.env.JWT_SECRET_KEY;
const jwtexpiration = process.env.JWT_EXPIRATION;

exports.login = async (req, res) => {
    try {
        const [user] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM userAccount WHERE email = ?',
                [req.body.email],
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        if (!user || user.length === 0) {
            return res
                .status(401)
                .json({ error: 'Incorrect email or password.' });
        }
        const isMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(
                req.body.password,
                user.password,
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        if (!isMatch) {
            return res.status(401).json({
                error: 'Incorrect email or password.',
            });
        }

        const token = jwt.sign({ id: user.id }, jwtsecretkey, {
            expiresIn: jwtexpiration,
        });
        res.cookie('token', token, opts.options).send();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user already exists
        const [user] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM userAccount WHERE email = ?',
                [email],
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        if (user) {
            console.log('Email already exists');
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        // Insert the new user into the database
        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO userAccount (email, password) VALUES (?, ?)',
                [email, hashedPassword],
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        // Create a JWT
        const token = jwt.sign({ email: email }, jwtsecretkey, {
            expiresIn: jwtexpiration,
        });

        res.cookie('token', token, opts.options);
        res.status(200)
            .json({
                message: 'Signup successful.',
            })
            .send();
    } catch (error) {
        return res.status(500).json({
            message: 'Error occurred during signup.',
        });
    }
};
