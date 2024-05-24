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
        flight.subtotal,
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
        return res
            .status(200)
            .json({ message: 'Booking created successfully.' });
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
    const query = `SELECT * FROM booking WHERE bookingID = ?`;
    try {
        const [rows] = await db.query(query, [bookingID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}
