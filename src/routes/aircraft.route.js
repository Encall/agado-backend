const router = require('express').Router();
const aircraftController = require('../controllers/aircraft.controller');

router.get('/:aircraftID', aircraftController.getAircraftByID);
router.get('/', aircraftController.getAllAircrafts);

router.post('/create', aircraftController.createAircraft);
router.post('/:aircraftID', aircraftController.editAircraftByID);

module.exports = router;
