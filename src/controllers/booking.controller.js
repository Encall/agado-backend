const db = require('../configs/db');
const mysql = require('mysql2/promise');
const { uuidv7 } = require('uuidv7');

// POST /booking/create
exports.createBooking = async (req, res) => {
    const {
        flight,
        passengers,
        emergencyContact,
        flightPackage,
        travelInsurance,
        payment,
        price,
    } = req.body;

    const bookingUUID = uuidv7();

    const bookingQuery = `INSERT INTO booking (bookingID, flightID, userID, bookingDateTime) VALUES (?)`;
    const bookingData = [
        bookingUUID,
        flight.flightID,
        req.user.userid,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
    ];

    const passengerQuery =
        'INSERT INTO passenger (passengerID, bookingID, firstName, middleName, lastName, email, phoneNumber, nationality, dateOfBirth, luggageWeight) VALUES ?';
    const passengerData = passengers.map((passenger) => [
        uuidv7(),
        bookingUUID,
        passenger.firstName,
        passenger.middleName,
        passenger.lastName,
        passenger.email,
        passenger.phoneNumber,
        passenger.nationality,
        passenger.dateOfBirth,
        parseInt(passenger.bagCount.split(' ')[1]) || 7,
    ]);

    const paymentQuery = `INSERT INTO payment (paymentID, bookingID, userID, holderName, cardNumber, ccv, expiryDate , amount , paymentDateTime) VALUES (?)`;
    const paymentData = [
        uuidv7(),
        bookingUUID,
        req.user.userid,
        payment.holderName,
        payment.cardNumber,
        payment.ccv,
        payment.expiryDate,
        flight.subtotal,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
    ];

    const ticketQuery = `INSERT INTO ticket (ticketNO, bookingID, passengerID, price, seatNumber, class) VALUES ?`;
    const ticketData = passengers.map((passenger, index) => [
        uuidv7(),
        bookingUUID,
        passengerData[index][0],
        price,
        passenger.seat,
        'economy',
    ]);

    const externalServiceQuery = `INSERT INTO externalService (ticketNo, serviceType, serviceDetail, serviceFee) VALUES ?`;
    const externalServices = [];

    // Iterate over each passenger
    passengers.forEach((passenger, index) => {
        // Initialize an empty object to hold the services for this passenger
        const services = {};

        // If the flightPackage is not 'Basic', add a 'flightPackage' service
        if (flightPackage !== 'Basic') {
            services.flightPackage = ['flightPackage', flightPackage, 100];
        }

        // If travelInsurance is not empty, add a 'travelInsurance' service
        if (travelInsurance !== '') {
            services.travelInsurance = [
                'travelInsurance',
                'Travel Insurance',
                350,
            ];
        }

        // If the passenger has a bag count, add a 'luggageWeight' service
        if (passenger.bagCount) {
            services.luggageWeight = [
                'luggageWeight',
                `Luggage ${passenger.bagCount}`,
                parseInt(passenger.bagCount.split(' ')[3]),
            ];
        }

        // Add the services for this passenger to the externalServices array
        externalServices.push({
            ticketID: ticketData[index][0],
            services,
        });
    });

    // Initialize an empty array to hold the external service data
    let externalServiceData = [];

    // Iterate over each service in the externalServices array
    externalServices.forEach((service) => {
        // Iterate over each key in the services object
        Object.keys(service.services).forEach((key) => {
            // Add an array with the ticketID, serviceType, serviceDetail, and serviceFee to the externalServiceData array
            externalServiceData.push([
                service.ticketID,
                ...service.services[key],
            ]);
        });
    });
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [bookingRows] = await connection.query(bookingQuery, [
            bookingData,
        ]);
        // console.log('Booking:',bookingRows);

        const [passengerRows] = await connection.query(passengerQuery, [
            passengerData,
        ]);
        // console.log('Passenger:',passengerRows);

        const [paymentRows] = await connection.query(paymentQuery, [
            paymentData,
        ]);
        // console.log('Payment:',paymentRows);

        const [ticketRows] = await connection.query(ticketQuery, [ticketData]);
        // console.log('Ticket:',ticketRows);

        const [externalServiceRows] = await connection.query(
            externalServiceQuery,
            [externalServiceData]
        );
        // console.log('ExternalService:',externalServiceRows);

        console.log('Booking created successfully.');
        await connection.commit();
        return res.status(200).json({
            message: 'Booking created successfully.',
            bookingID: bookingUUID,
        });
    } catch (error) {
        await connection.rollback();
        await connection.release();
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while creating booking',
        });
    }
};

// GET /booking/:bookingID
exports.getBookingById = async (req, res) => {
    const bookingID = req.params.bookingID;
    console.log('Booking ID:', bookingID);
    const query = `
SELECT 
    b.*, 
    f.*, 
    p.*, 
    pay.*, 
    t.*, 
    a.airlineName,
    departureAirport.city AS departureCity, 
    arrivalAirport.city AS arrivalCity,
    departureAirport.IATACode AS departureIATACode,
    arrivalAirport.IATACode AS arrivalIATACode,
    arrivalAirport.airportName AS arrivalAirportName,
    departureAirport.airportName AS departureAirportName
FROM booking AS b
JOIN flight AS f ON b.flightID = f.flightID
JOIN aircraft AS ac ON f.aircraftID = ac.aircraftID
JOIN airline AS a ON ac.airlineID = a.airlineID
JOIN airport AS departureAirport ON f.departureAirportID = departureAirport.airportID
JOIN airport AS arrivalAirport ON f.arrivalAirportID = arrivalAirport.airportID
JOIN passenger AS p ON b.bookingID = p.bookingID
JOIN payment AS pay ON b.bookingID = pay.bookingID 
JOIN ticket AS t ON b.bookingID = t.bookingID
WHERE b.bookingID = ?
GROUP BY t.ticketNo
`;
    try {
        const [rows] = await db.query(query, [bookingID]);
        console.log('Rows:', rows.length);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

exports.cancelBooking = async (req, res) => {
    const bookingID = req.body.bookingID;
    const reason = req.body.reasons;
    const customReason = req.body.customReason;
    const bank = req.body.bank;
    const accountNumber = req.body.accountNumber;
    console.log(req.body);

    console.log(bookingID);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Update booking status to 'refund'
        let [rows] = await connection.query(
            `UPDATE booking SET status = 'refund' WHERE bookingID = ?`,
            [bookingID]
        );
        if (rows.affectedRows === 0) {
            throw new Error('Booking not found');
        }

        // Update ticket status to 'refund'
        [rows] = await connection.query(
            `UPDATE ticket SET status = 'refund' WHERE bookingID = ?`,
            [bookingID]
        );
        if (rows.affectedRows === 0) {
            throw new Error('Ticket not found');
        }

        // Get flightID from booking
        const [bookingRows] = await connection.query(
            `SELECT flightID FROM booking WHERE bookingID = ?`,
            [bookingID]
        );
        const flightID = bookingRows[0].flightID;

        // Decrease currentCapacity of flight by 1
        [rows] = await connection.query(
            `UPDATE flight SET currentCapacity = currentCapacity - 1 WHERE flightID = ?`,
            [flightID]
        );
        if (rows.affectedRows === 0) {
            throw new Error('Flight not found');
        }

        await connection.commit();

        res.status(200).json({ message: 'Booking cancelled' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    } finally {
        connection.release();
    }
};
