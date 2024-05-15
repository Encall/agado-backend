const router = require('express').Router();
const flightController = require('../controllers/flight.controller');

router.get('/:flightID', flightController.getFlightById);
router.get('/', flightController.getAllFlights);

router.post('/create', flightController.createFlight);
router.post('/edit', flightController.editFlight);

module.exports = router;
