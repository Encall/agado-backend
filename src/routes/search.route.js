const router = require('express').Router();
const schema = require('../drizzle/schema');
const { like, or } = require('drizzle-orm');
const db = require('../configs/db');

// GET /search?query=term
router.get('/airports', async (req, res) => {
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