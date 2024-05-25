const router = require('express').Router();
const searchController = require('../controllers/search.controller');

router.get('/airports', searchController.airports);
router.get('/airports/recommend', searchController.recommendAirports);

router.get('/flights', searchController.searchFlights);
router.get('/airlines', searchController.getAllAirline);
router.get('/employees', searchController.getAllEmployees);
router.get('/aircrafts', searchController.getAllAircrafts);

module.exports = router;
