const router = require('express').Router();
const searchController = require('../controllers/search.controller');

// GET /search?query=term
router.get('/airports', searchController.airports);
// GET /search/airports/recommend?number={amount_of_airports}
// * for recommend specify number of airports from client, example: initialize dropdown if term = ""
router.get('/airports/recommend', searchController.recommendAirports);

module.exports = router;
