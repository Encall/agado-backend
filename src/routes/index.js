const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../configs/db');
const authRoute = require('./auth.route');

router.use('/', authRoute);

router.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Protected route' });
    }
);

router.get(
    '/airports',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const airports = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Airport', function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
        res.json(airports);
    }
);

module.exports = router;
