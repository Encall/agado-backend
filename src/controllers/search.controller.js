const db = require('../configs/db');

exports.airports = async (req, res) => {
    try {
        const searchTerm = req.query.query;
        const query = `
            SELECT
                airportName,
                city,
                countryCode AS country,
                IATACode AS iata
            FROM
                airport
            WHERE
                airportName LIKE ?
                OR city LIKE ?
                OR countryCode LIKE ?
                OR IATACode LIKE ?
        `;
        const params = [
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
        ];
        const airports = await db.query(query, params);
        res.json(airports[0]);
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
        // Query to get all airport IDs
        const airportIdsQuery = `SELECT airportID FROM airport`;
        const [airportIdObjects] = await db.query(airportIdsQuery);
        if (!airportIdObjects || airportIdObjects.length === 0) {
            throw new Error('No airport IDs found');
        }

        // Generate random airport IDs
        const randomAirportIds = [];
        for (let i = 0; i < number; i++) {
            const randomIndex = Math.floor(
                Math.random() * airportIdObjects.length
            );
            randomAirportIds.push(airportIdObjects[randomIndex].airportID);
        }

        // Query to get recommended airports
        const recommendedAirportsQuery = `SELECT airportName, city, countryCode AS country, IATACode as iata 
            FROM airport WHERE airportID IN (${randomAirportIds.join(',')})`;
        const [airports] = await db.query(recommendedAirportsQuery);
        res.status(200).json(airports);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while recommending airports',
        });
    }
};

exports.searchFlights = async (req, res) => {
    const searchParams = req.query;

    const { from, to, departDate, adult, child, infant } = searchParams;

    const query = `
    SELECT
        flight.*,
        airline.airlineName,
        departureAirport.IATACode AS \`from\`,
        arrivalAirport.IATACode AS \`destination\`
    FROM
        flight
    JOIN
        airport AS departureAirport ON flight.departureAirportID = departureAirport.airportID
    JOIN
        airport AS arrivalAirport ON flight.arrivalAirportID = arrivalAirport.airportID
    JOIN
        aircraft ON flight.aircraftID = aircraft.aircraftID
    JOIN
        airline ON aircraft.airlineID = airline.airlineID
    WHERE
        departureAirport.IATACode = ?
        AND arrivalAirport.IATACode = ?
`;
    const params = [from, to];

    try {
        const [flights] = await db.query(query, params);
        const formattedFlights = flights.map((flight) => {
            const departureTime = new Date(flight.departureDateTime);
            const arrivalTime = new Date(flight.arrivalDateTime);
            const durationInMinutes = Math.round(
                (arrivalTime - departureTime) / (1000 * 60)
            );

            return {
                flightID: flight.flightID,
                airlineIcon:
                    'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Hawaiian_Airlines_logo_2017.svg/800px-Hawaiian_Airlines_logo_2017.svg.png',
                airline: flight.airlineName,
                flightNumber: flight.flightNo,
                departureTime: departureTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                }),
                arrivalTime: arrivalTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                }),
                duration: durationInMinutes.toString(), // Convert duration to string
                from: flight.from,
                destination: flight.destination,
                subtotal: flight.baseFare,
            };
        });

        res.status(200).json(formattedFlights);
    } catch (error) {
        console.error('An error occurred while searching for flights:', error);
        res.status(500).json({
            message: 'An error occurred while searching for flights',
        });
    }
};
