const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const authRoute = require('./auth.route');
const schema = require('../drizzle/schema');

router.use('/', authRoute);

router.get('/airports', async (req, res) => {
    try {
        const airports = await db.select().from(schema.airport);
        res.json(airports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching airports' });
    }
});


module.exports = router;
