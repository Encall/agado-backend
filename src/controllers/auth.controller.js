import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../configs/db.js';
import schema from '../drizzle/schema/userAccount.js';
import opts from '../configs/cookie-config.js';
import { sql, eq } from 'drizzle-orm';

dotenv.config();

const jwtsecretkey = process.env.JWT_ACCESS_SECRET_KEY;
const jwtexpiration = process.env.JWT_ACCESS_EXPIRATION;

const userAccount = schema.userAccount;

export const login = async (req, res) => {
    try {
        const [user] = await db
            .select()
            .from(userAccount)
            .where(eq(userAccount.email, req.body.email));
        console.log(req.body.email);
        console.log(user);
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

        const accessToken = jwt.sign({ id: user.userID }, jwtsecretkey, {
            expiresIn: jwtexpiration,
        });
        const refreshToken = jwt.sign(
            { id: user.userID },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);

        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user already exists
        var [user] = await db
            .select()
            .from(userAccount)
            .where(eq(userAccount.email, req.body.email));
        console.log(user);
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

        await db.insert(userAccount).values({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        });

        console.log('User created successfully.');
        [user] = await db
            .select()
            .from(userAccount)
            .where(sql`${userAccount.userID} = LAST_INSERT_ID()`);
        console.log('query successful');
        console.log(user);
        // Create a JWT
        const accessToken = jwt.sign({ id: user.userID }, jwtsecretkey, {
            expiresIn: jwtexpiration,
        });
        const refreshToken = jwt.sign(
            { id: user.userID },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);

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

export const jwtRefreshTokenValidate = (req, res, next) => {
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
        console.log(req.user);
        next();
    } catch (error) {
        console.log('Error verifying refresh token:', error);
        return res.sendStatus(403);
    }
};

export const refresh = async (req, res) => {
    db.select()
        .from(userAccount)
        .where(eq(userAccount.userID, req.user.id))
        .then(([user]) => {
            // console.log(user)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const accessToken = jwt.sign(
                { id: user.userID },
                process.env.JWT_ACCESS_SECRET_KEY,
                { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
            );
            const refreshToken = jwt.sign(
                { id: user.userID },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
            );

            res.cookie('accessToken', accessToken, opts.options);
            res.cookie('refreshToken', refreshToken, opts.refreshOptions);
            return res.status(200).send();
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        });
};
