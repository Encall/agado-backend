const passport = require('passport');
const router = require('express').Router();
const dashboardAuthController = require('../controllers/auth.dashboard.controller');

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

module.exports = router;
