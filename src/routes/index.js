const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const authRoute = require('./auth.route');
const dashboardRoute = require('./dashboard.route');
const schema = require('../drizzle/schema');
const { like, or } = require('drizzle-orm');

router.use('/', authRoute);
router.use('/dashboard', dashboardRoute);

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

// GET /search?query=term
router.get('/search/airports', async (req, res) => {
    try {
        const searchTerm = req.query.query;
        const airports = await db
            .select({
                airportName: schema.airport.airportName,
                city: schema.airport.city,
                country: schema.airport.countryCode,
                iata: schema.airport.IATACode,
            })
            .from(schema.airport)
            .where(
                or(
                    like(schema.airport.airportName, `%${searchTerm}%`),
                    like(schema.airport.city, `%${searchTerm}%`),
                    like(schema.airport.countryCode, `%${searchTerm}%`),
                    like(schema.airport.IATACode, `%${searchTerm}%`)
                )
            );
        res.json(airports);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while searching airports',
        });
    }
});

module.exports = router;
