const db = require('../configs/db');

exports.getFlightById = async (req, res) => {
    const flightID = req.params.flightID;
    try {
        const query = `
            SELECT
                flight.flightID,
                flight.flightNo,
                flight.currentCapacity,
                flight.baseFare,
                flight.departureDateTime,
                flight.arrivalDateTime,
                aircraft.*, 
                airline.airlineName,
                departureAirport.IATACode AS departureIATACode,
                arrivalAirport.IATACode AS arrivalIATACode,
                departureAirport.city AS departureCity,
                arrivalAirport.city AS arrivalCity
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
                airlineIcon:
                    'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Hawaiian_Airlines_logo_2017.svg/800px-Hawaiian_Airlines_logo_2017.svg.png',
                airlineName: flight.airlineName,
                flightID: flight.flightID,
                flightNo: flight.flightNo,
                departureTime: flight.departureDateTime.toLocaleTimeString(
                    'en-US',
                    {
                        hour: 'numeric',
                        minute: 'numeric',
                    }
                ),
                arrivalTime: flight.arrivalDateTime.toLocaleTimeString(
                    'en-US',
                    {
                        hour: 'numeric',
                        minute: 'numeric',
                    }
                ),
                duration: durationInMinutes,
                from: flight.departureIATACode,
                destination: flight.arrivalIATACode,
                subtotal: flight.baseFare,
                arrivalCity: flight.arrivalCity,
                departureCity: flight.departureCity,
                departureTimeDate: departureTime,
                arrivalTimeDate: arrivalTime,
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
                flight.flightID,
                flight.flightNo, 
                airline.airlineName,
                departureAirport.city AS departureCity, 
                arrivalAirport.city AS arrivalCity,
                departureAirport.IATACode AS departureIATACode,
                arrivalAirport.IATACode AS arrivalIATACode,
                flight.departureDateTime, 
                flight.arrivalDateTime,
                flight.currentCapacity,
                flight.baseFare,
                flight.status
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
            ORDER BY flight.flightNo
            `;
        const [flights] = await db.query(query);
        res.status(200).json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all flights',
        });
    }
};

exports.createFlight = async (req, res) => {
    const { flight,task,cabinCrewTask } = req.body;
    console.log(flight);
    console.log(task);
    console.log(cabinCrewTask);
    const connection = await db.getConnection();
    console.log(flight);
    flight.departureDateTime = new Date(flight.departureDateTime).toISOString();
    flight.arrivalDateTime = new Date(flight.arrivalDateTime).toISOString();
    try {
        await connection.beginTransaction();
        const queryFlight = `
            INSERT INTO flight (
                aircraftID,
                departureAirportID,
                arrivalAirportID,
                arrivalDateTime,
                departureDateTime,
                flightNo,
                currentCapacity,
                status,
                baseFare
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.query(queryFlight, [
            flight.aircraftID,
            flight.departureAirportID,
            flight.arrivalAirportID,
            flight.arrivalDateTime,
            flight.departureDateTime,
            flight.flightNo,
            flight.currentCapacity,
            flight.status,
            flight.baseFare,
        ]);

        const newFlightId = result.insertId;

        const queryTask = `
            INSERT INTO employeeTask (
                employeeID,
                assignDateTime,
                taskType,
                taskDescription,
                status,
                flightID
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const currentTime = new Date().toISOString().slice(0, 16);
        await Promise.all(
            task.map((t) => {
                return connection.query(queryTask, [
                    t.employeeID,
                    currentTime,
                    t.taskType,
                    t.taskDescription,
                    t.status,
                    t.flightID,
                ]);
            })
        );
        const queryCabinCrewTask = `
            INSERT INTO employeeTask (
                employeeID,
                assignDateTime,
                taskType,
                taskDescription,
                status,
                flightID
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        await Promise.all(
            cabinCrewTask.map((t) => {
                return connection.query(queryCabinCrewTask, [
                    t.employeeID,
                    currentTime,
                    t.taskType,
                    t.taskDescription,
                    t.status,
                    t.flightID,
                ]);
            })
        );
        const [newFlight] = await connection.query(
            `
        SELECT 
        flight.flightID,
        flight.flightNo, 
        airline.airlineName,
        departureAirport.city AS departureCity, 
        arrivalAirport.city AS arrivalCity,
        departureAirport.IATACode AS departureIATACode,
        arrivalAirport.IATACode AS arrivalIATACode,
        flight.departureDateTime, 
        flight.arrivalDateTime,
        flight.currentCapacity,
        flight.baseFare,
        flight.status
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
    WHERE flight.flightID = ?
        `,
            [newFlightId]
        );

        await connection.commit();
        console.log('create flight success');
        res.status(200).json({newFlight});
        // res.status(200).json({
        //     message: 'Flight created and employee task assigned successfully',
        // });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error(error);
        res.status(500).json({
            message:
                'An error occurred while creating flight and assigning employee task',
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.editFlight = async (req, res) => {
    const flight = req.body;
    const {
        flightID,
        flightNo,
        airlineName,
        departureCity,
        arrivalCity,
        departureIATACode,
        arrivalIATACode,
        departureDateTime,
        arrivalDateTime,
        currentCapacity,
        baseFare,
        aircraft,
    } = flight;

    const intBaseFare = parseInt(baseFare);
    const intCurrentCapacity = parseInt(currentCapacity);

    const connection = await db.getConnection();
    try {
        const queryAircrafts = `
            SELECT aircraft.aircraftID
            FROM aircraft
            JOIN airline ON aircraft.airlineID = airline.airlineID
            WHERE airline.airlineName = ?
        `;
        const [aircrafts] = await db.query(queryAircrafts, [airlineName]);
        // If no aircrafts found, return an error
        if (!aircrafts || aircrafts.length === 0) {
            return res.status(404).json({
                message: 'No aircrafts found for this airline',
            });
        }

        const aircraftIDs = aircrafts.map((aircraft) => aircraft.aircraftID);
        const queryAirports = `
        SELECT airportID as departureAirportID, NULL as arrivalAirportID
FROM airport
WHERE IATACode = ?
UNION ALL
SELECT NULL as departureAirportID, airportID as arrivalAirportID
FROM airport
WHERE IATACode = ?
        `;
        const [airports] = await db.query(queryAirports, [
            departureIATACode,
            arrivalIATACode,
        ]);
        const departureAirportID = airports[0].departureAirportID;
        const arrivalAirportID = airports[1].arrivalAirportID;
        await connection.beginTransaction();

        const updateQuery = `
            UPDATE flight
            SET flightNo = ?,
                currentCapacity = ?,
                baseFare = ?,
                departureDateTime = ?,
                arrivalDateTime = ?,
                aircraftID = ?,
                departureAirportID = ?,
                arrivalAirportID = ?
            WHERE flightID = ?
        `;

        await db.query(updateQuery, [
            flightNo,
            intCurrentCapacity,
            intBaseFare,
            departureDateTime,
            arrivalDateTime,
            aircraftIDs[0],
            departureAirportID,
            arrivalAirportID,
            flightID,
        ]);

        await connection.commit();
        res.status(200).json({
            message: 'Flight updated successfully',
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating a flight',
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
