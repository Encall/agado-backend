const passport = require('passport');
const router = require('express').Router();
const dashboardAuthController = require('../controllers/auth.dashboard.controller');
const dashboardController = require('../controllers/dashboard.controller');

const checkUserRole = (requiredRoles) => (req, res, next) => {
    if (req.user && requiredRoles.includes(req.user.role)) {
        return next();
    } else {
        return res
            .status(403)
            .json({ message: 'Access denied. Insufficient permissions.' });
    }
};

router.post('/signup', dashboardAuthController.signup);
router.post('/login', dashboardAuthController.login);

router.get(
    '/test',
    passport.authenticate('jwt', { session: false }),
    checkUserRole([0, 1]),
    (req, res) => {
        // This route is only accessible to users with 0 or 1 role
        res.json({ message: 'Admin dashboard' });
    }
);

// router.get('/overview', dashboardController.overview);
router.get(
    '/overview/flights/:month/:year',
    dashboardController.getMostFlightsAirlinePerMonth
);
router.get('/overview/revenue', dashboardController.getMostAirlineRevenue);
router.get(
    '/overview/destination',
    dashboardController.getMostPopularDestinations
);
router.get('/overview/revenueperday', dashboardController.getRevenuePerDay);
router.get('/overview/flightsperweek', dashboardController.getFlightsPerWeek);
router.get('/overview/dailypassenger', dashboardController.getDailyPassenger);
router.get('/overview/airlinerevenue', dashboardController.getAirlineRevenue);
router.get('/overview/totalPassenger', dashboardController.totalPassenger);
router.get(
    '/overview/flightsDestination',
    dashboardController.flightsDestination
);
router.get('/overview/mostusedaircraft', dashboardController.mostUsedAircraft);
router.get('/overview/statuspercentage', dashboardController.statusPercentage);
router.get('/overview/usercount', dashboardController.usercount);
router.get('/overview/employeecount', dashboardController.employeeCount);
router.get(
    '/overview/airlinepercentage',
    dashboardController.airlinePercentage
);

module.exports = router;
