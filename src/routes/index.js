const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const authRoute = require('./auth.route');
const dashboardRoute = require('./dashboard.route');
const searchRoute = require('./search.route');
const healthcheckRoute = require('./healthcheck.route');
const profileRoute = require('./profile.route');
const schema = require('../drizzle/schema');

router.use('/', authRoute);
router.use('/health', healthcheckRoute);
router.use('/dashboard', dashboardRoute);
router.use('/search', searchRoute);
router.use('/profile', profileRoute);


router.get('/airports', async (req, res) => {
    try {
        const airports = await db
            .select({
                airportName: schema.airport.airportName,
                city: schema.airport.city,
                country: schema.airport.countryCode,
                iata: schema.airport.IATACode,
            })
            .from(schema.airport);
        res.json(airports);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while fetching airports',
        });
    }
});

module.exports = router;
