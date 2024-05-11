const router = require('express').Router();
const flightController = require('../controllers/flight.controller');

router.get('/:flightID', flightController.getFlightById);

module.exports = router;
