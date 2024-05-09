const express = require('express');
const router = express.Router();
const db = require('../configs/db');
const authRoute = require('./auth.route');
const dashboardRoute = require('./dashboard.route');
const searchRoute = require('./search.route');
const healthcheckRoute = require('./healthcheck.route');
const profileRoute = require('./profile.route');
const schema = require('../drizzle/schema');

router.use('/', authRoute);
router.use('/health', healthcheckRoute);
router.use('/dashboard', dashboardRoute);
router.use('/search', searchRoute);
router.use('/profile', profileRoute);

module.exports = router;
