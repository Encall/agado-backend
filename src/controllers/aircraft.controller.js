const db = require('../configs/db');

exports.getAllAircrafts = async (req, res) => {
    try {
        const query = `
        SELECT
            a.aircraftID,
            a.airlineID,
            al.airlineName,
            a.aircraftCallSign,
            a.manufacturer,
            a.model,
            a.maxCapacity,
            a.status
        FROM
            aircraft a
        JOIN
            airline al ON a.airlineID = al.airlineID
        ORDER BY a.aircraftID DESC;
        `;
        const [aircrafts] = await db.query(query);
        res.status(200).json(aircrafts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all flights',
        });
    }
};

exports.getAircraftByID = async (req, res) => {
    const aircraftID = req.params.aircraftID;
    try {
        const query = `
        SELECT
            a.aircraftID,
            a.airlineID,
            al.airlineName,
            a.aircraftCallSign,
            a.manufacturer,
            a.model,
            a.maxCapacity,
            CASE
                WHEN a.status = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS status
        FROM
            aircraft a
        JOIN
            airline al ON a.airlineID = al.airlineID
        WHERE a.aircraftID = ?
        `;
        const [aircrafts] = await db.query(query, [aircraftID]); // Pass aircraftID inside an array
        res.status(200).json(aircrafts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting the aircraft by ID',
        });
    }
};

exports.createAircraft = async (req, res) => {
    try {
        const {
            airlineName,
            aircraftCallSign,
            manufacturer,
            model,
            maxCapacity,
            status,
        } = req.body;

        // Connect to the database
        const connection = await db.getConnection();

        // Start a transaction
        await connection.beginTransaction();

        try {
            // Get the airlineID from the airline table
            const [airlineResult] = await connection.query(
                'SELECT airlineID FROM airline WHERE airlineName = ?',
                [airlineName]
            );
            const airlineID = airlineResult[0]?.airlineID;

            if (!airlineID) {
                throw new Error('Airline not found');
            }

            // Insert the new aircraft
            const statusValue = status;
            const [insertResult] = await connection.query(
                'INSERT INTO aircraft (airlineID, aircraftCallSign, manufacturer, model, maxCapacity, status) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    airlineID,
                    aircraftCallSign,
                    manufacturer,
                    model,
                    maxCapacity,
                    statusValue,
                ]
            );
            const aircraftID = insertResult.insertId;

            // Retrieve the newly created aircraft
            const [newAircraftResult] = await connection.query(
                `
            SELECT
              a.aircraftID,
              al.airlineID,
              a.aircraftCallSign,
              a.manufacturer,
              a.model,
              a.maxCapacity,
              CASE
                WHEN a.status = 1 THEN 'Active' 
                WHEN a.status = 2 THEN 'Maintenance'
                ELSE 'Inactive'
              END AS status
            FROM
              aircraft a
            JOIN
              airline al ON a.airlineID = al.airlineID
            WHERE
              a.aircraftID = ?
          `,
                [aircraftID]
            );

            // Commit the transaction
            await connection.commit();

            res.status(201).json(newAircraftResult[0]);
        } catch (err) {
            // Rollback the transaction if there's an error
            await connection.rollback();
            throw err;
        } finally {
            // Release the connection
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.editAircraftByID = async (req, res) => {
    const aircraftID = req.params.aircraftID;
    const {
        airlineName,
        aircraftCallSign,
        manufacturer,
        model,
        maxCapacity,
        status,
    } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction

        // Get the airlineID from the airline table
        const [airlineResult] = await connection.query(
            'SELECT airlineID FROM airline WHERE airlineName = ?',
            [airlineName]
        );

        if (airlineResult.length === 0) {
            throw new Error('Airline not found');
        }

        const airlineID = airlineResult[0].airlineID;

        const updateAircraftQuery = `
        UPDATE aircraft
        SET airlineID = ?, aircraftCallSign = ?, manufacturer = ?, model = ?, maxCapacity = ?, status = ?
        WHERE aircraftID = ?
        `;
        const values = [
            airlineID,
            aircraftCallSign,
            manufacturer,
            model,
            maxCapacity,
            status,
            aircraftID,
        ];
        
        await connection.query(updateAircraftQuery, values);
        await connection.commit(); // Commit transaction

        res.status(200).json({ message: 'Aircraft updated successfully' });
    } catch (error) {
        if (connection) {
            await connection.rollback(); // Rollback transaction in case of error
        }
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating the aircraft',
        });
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};