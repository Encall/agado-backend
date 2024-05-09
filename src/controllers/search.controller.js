const schema = require('../drizzle/schema');
const db = require('../configs/db');

exports.airports = async (req, res) => {
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
};

// Recommend airports
exports.recommendAirports = async (req, res) => {
    try {
        const number = req.query.number;
        const airportIdObjects = await db
            .select({ airportID: schema.airport.airportID })
            .from(schema.airport);

        const randomAirportIds = [];
        for (let i = 0; i < number; i++) {
            const randomIndex = Math.floor(
                Math.random() * airportIdObjects.length
            );
            randomAirportIds.push(airportIdObjects[randomIndex].airportID);
        }

        const airports = await db
            .select({
                airportName: schema.airport.airportName,
                city: schema.airport.city,
                country: schema.airport.countryCode,
                iata: schema.airport.IATACode,
            })
            .from(schema.airport)
            .where(inArray(schema.airport.airportID, randomAirportIds));
        res.json(airports);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while recommending airports',
        });
    }
};
