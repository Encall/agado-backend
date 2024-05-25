const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const authRoute = require('./auth.route');
const dashboardRoute = require('./dashboard.route');
const searchRoute = require('./search.route');
const healthcheckRoute = require('./healthcheck.route');
const profileRoute = require('./profile.route');
const flightRoute = require('./flight.route');
const employeeRoute = require('./employee.route');
const passengerRoute = require('./passenger.route');
const bookingRoute = require('./booking.route');
const aircraftRoute = require('./aircraft.route');
const schema = require('../drizzle/schema');


router.use('/', authRoute);
router.use('/health', healthcheckRoute);
router.use('/dashboard', dashboardRoute);
router.use('/search', searchRoute);
router.use('/profile', profileRoute);
router.use('/flight', flightRoute);
router.use('/employee', employeeRoute);
router.use('/passenger', passengerRoute);
router.use('/booking', bookingRoute);
router.use('/aircraft', aircraftRoute);

module.exports = router;
