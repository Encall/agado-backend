const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../configs/db');
const authRoute = require('./auth.route');
const schema = require('../drizzle/schema');

const airportSchema = schema.airport;

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
        const airports = await db.select().from(airportSchema);
        res.json(airports);
    }
);

module.exports = router;
