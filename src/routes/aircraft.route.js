const router = require('express').Router();
const aircraftController = require('../controllers/aircraft.controller');

router.get('/:aircraftID', aircraftController.getAircraftByID);
router.get('/', aircraftController.getAllAircrafts);

router.post('/create', aircraftController.createAircraft);
router.post('/edit/:aircraftID', aircraftController.editAircraftByID);
router.post('/maintenance', aircraftController.maintenanceAircraft);

module.exports = router;
