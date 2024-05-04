require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');
const schema = require('../drizzle/schema');
const opts = require('../configs/cookie-config');
const { sql, eq } = require('drizzle-orm');
const jwtsecretkey = process.env.JWT_ACCESS_SECRET_KEY;
const jwtexpiration = process.env.JWT_ACCESS_EXPIRATION;
const { v4: uuidv4 } = require('uuid');

exports.login = async (req, res) => {
    try {
        const [user] = await db
            .select()
            .from(schema.userAccount)
            .where(eq(schema.userAccount.email, req.body.email));
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
    // Check if all fields are provided
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
        return res.status(400).json({
            message:
                'All fields are required. Please provide email, password, first name, last name, and phone number.',
        });
    }

    try {
        // Check if user already exists
        var [user] = await db
            .select()
            .from(schema.userAccount)
            .where(eq(schema.userAccount.email, req.body.email));
        if (user) {
            console.log('Email already exists');
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        // Generate UUID for user
        const uuid = uuidv4();

        await db.insert(schema.userAccount).values({
            userID: uuid,
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        });

        console.log('User: %s Email: %s created successfully.', uuid, email);

        // Set user role to 0 (default) (0 = user)
        const role = 0;

        // Create a JWT
        const accessToken = jwt.sign({ id: uuid, role: role }, jwtsecretkey, {
            expiresIn: jwtexpiration,
        });
        const refreshToken = jwt.sign(
            { id: uuid, role: role },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
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
            return res.sendStatus(403);
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
    db.select()
        .from(schema.userAccount)
        .where(eq(schema.userAccount.userID, req.user.id))
        .then(([user]) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const role = 0;

            const accessToken = jwt.sign(
                { id: user.userID, role: role },
                process.env.JWT_ACCESS_SECRET_KEY,
                { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { id: user.userID, role: role },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
            );

            console.log('User: %s has refresh access token.', user.email);
            res.cookie('accessToken', accessToken, opts.options);
            res.cookie('refreshToken', refreshToken, opts.refreshOptions);
            return res
                .status(200)
                .json({
                    message: 'Token refresh successful.',
                })
                .send();
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        });
};
