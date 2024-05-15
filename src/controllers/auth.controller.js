require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');
const opts = require('../configs/cookie-config');
const jwtsecretkey = process.env.JWT_ACCESS_SECRET_KEY;
const jwtexpiration = process.env.JWT_ACCESS_EXPIRATION;
const { uuidv7 } = require('uuidv7');

const createTokens = (user, role) => {
    const accessToken = jwt.sign(
        { id: user.userID, role: role },
        jwtsecretkey,
        {
            expiresIn: jwtexpiration,
        }
    );
    const refreshToken = jwt.sign(
        { id: user.userID, role: role },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        }
    );

    return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
    try {
        const query =
            'SELECT userID, email, password, firstName FROM userAccount WHERE email = ?';
        const [[user]] = await db.query(query, [req.body.email]);

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

        // Set user role to 0 (default) (0 = user)
        const role = 0;

        const { accessToken, refreshToken } = createTokens(user, role);

        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);
        console.log('User: %s logged in successfully.', user.email);
        return res
            .status(200)
            .json({
                userid: user.userID,
                email: user.email,
                firstName: user.firstName,
                role: role,
            })
            .send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signup = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    try {
        let query = 'SELECT userID FROM userAccount WHERE email = ?';
        const [[user]] = await db.query(query, [req.body.email]);

        if (user) {
            console.log('Email already exists');
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        const uuid = uuidv7();

        query = `INSERT INTO userAccount (userID, email, password, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(query, [
            uuid,
            email,
            hashedPassword,
            firstName,
            lastName,
            phoneNumber,
        ]);

        console.log('User: %s Email: %s created successfully.', uuid, email);

        // Set user role to 0 (default) (0 = user)
        const role = 0;

        const { accessToken, refreshToken } = createTokens(
            { userID: uuid },
            role
        );

        console.log('User: %s signed up successfully.', email);
        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);
        res.status(200)
            .json({
                user: uuid,
                email: email,
                firstName: firstName,
                role: role,
            })
            .send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error occurred during signup.',
        });
    }
};

exports.jwtRefreshTokenValidate = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log('No refresh token provided');
            return res.sendStatus(400);
        }
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Error verifying refresh token:', error);
        return res.sendStatus(403);
    }
};

exports.refresh = async (req, res) => {
    try {
        const query = 'SELECT userID,email FROM userAccount WHERE userID = ?';
        const [[user]] = await db.query(query, [req.user.id]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const role = 0;

        const { accessToken, refreshToken } = createTokens(user, role);

        console.log('User: %s has refresh access token.', user.email);
        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);
        return res
            .status(200)
            .json({
                message: 'Token refresh successful.',
            })
            .send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('accessToken', opts.options);
    res.clearCookie('refreshToken', opts.refreshOptions);
    console.log('User logged out successfully.');
    return res.status(200).json({ message: 'Logged out successfully' });
};
