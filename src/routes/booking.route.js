const express = require('express');
const passport = require('passport');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// POST /booking/create
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    bookingController.createBooking
);

router.get('/:bookingID', bookingController.getBookingById);
router.post('/cancel', bookingController.cancelBooking);

module.exports = router;
