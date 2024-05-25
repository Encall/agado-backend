const router = require('express').Router();
const passengerController = require('../controllers/passenger.controller');

router.get('/', passengerController.getAllPassengers);

module.exports = router;
