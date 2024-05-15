const express = require('express');
const passport = require('passport');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// POST /booking/create
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        req.user.id = req.user.id; // or whatever property your user id is stored in
        next();
    },
    bookingController.createBooking
);

module.exports = router;
