const db = require('../configs/db');

exports.getFlightById = async (req, res) => {
    const flightID = req.params.flightID;
    try {
        const query = `
            SELECT
                flight.flightNo,
                flight.currentCapacity,
                flight.baseFare,
                flight.departureDateTime,
                flight.arrivalDateTime,
                aircraft.*, 
                airline.airlineName,
                departureAirport.IATACode AS departureIATACode,
                arrivalAirport.IATACode AS arrivalIATACode
            FROM flight
            JOIN aircraft ON flight.aircraftID = aircraft.aircraftID
            JOIN airline ON aircraft.airlineID = airline.airlineID
            JOIN airport AS departureAirport ON flight.departureAirportID = departureAirport.airportID
            JOIN airport AS arrivalAirport ON flight.arrivalAirportID = arrivalAirport.airportID
            WHERE flight.flightID = ?
        `;

        const [flights] = await db.query(query, [flightID]);
        if (!flights || flights.length === 0) {
            res.status(404).json({
                message: 'Flight not found',
            });
        } else {
            const flight = flights[0];
            const departureTime = new Date(flight.departureDateTime);
            const arrivalTime = new Date(flight.arrivalDateTime);
            const durationInMinutes = Math.round(
                (arrivalTime - departureTime) / (1000 * 60)
            );
            const flightData = {
                airlineIcon: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Hawaiian_Airlines_logo_2017.svg/800px-Hawaiian_Airlines_logo_2017.svg.png',
                airlineName: flight.airlineName,
                flightNo: flight.flightNo,
                departureTime: flight.departureDateTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                }),
                arrivalTime: flight.arrivalDateTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                }),
                duration: durationInMinutes,
                from: flight.departureIATACode,
                destination: flight.arrivalIATACode,
                subtotal: flight.baseFare,
            };
            res.status(200).json(flightData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting flight by ID',
        });
    }
};

exports.getAllFlights = async (req, res) => {
    try {
        const query = `
            SELECT 
                flight.flightNo, 
                airline.airlineName,
                departureAirport.city AS departureCity, 
                arrivalAirport.city AS arrivalCity,
                departureAirport.IATACode AS departureIATACode,
                arrivalAirport.IATACode AS arrivalIATACode,
                flight.departureDateTime, 
                flight.arrivalDateTime
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
            `;
        const [flights] = await db.query(query);
        res.status(200).json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all flights',
        });
    }
}

exports.createFlight = async (req, res) => {
    const { flightNo, currentCapacity, baseFare, departureDateTime, arrivalDateTime, aircraftID } = req.body;
    try {
        const query = `
            INSERT INTO 
                flight (flightNo, currentCapacity, baseFare, departureDateTime, arrivalDateTime, aircraftID)
            VALUES 
                (?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [flightNo, currentCapacity, baseFare, departureDateTime, arrivalDateTime, aircraftID]);
        res.status(200).json({
            message: 'Flight created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating a flight',
        });
    }
}

exports.updateFlight = async (req, res) => {
    const { flightID, flightNo, currentCapacity, baseFare, departureDateTime, arrivalDateTime, aircraftID } = req.body;
    try {
        const query = `
            UPDATE 
                flight
            SET 
                flightNo = ?,
                currentCapacity = ?,
                baseFare = ?,
                departureDateTime = ?,
                arrivalDateTime = ?,
                aircraftID = ?
            WHERE 
                flightID = ?
        `;
        await db.query(query, [flightNo, currentCapacity, baseFare, departureDateTime, arrivalDateTime, aircraftID, flightID]);
        res.status(200).json({
            message: 'Flight updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating a flight',
        });
    }
}
