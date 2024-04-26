const passport = require('passport');
const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post(
    '/refresh',
    authController.jwtRefreshTokenValidate,
    authController.refresh
);

router.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Protected route' });
    }
);

module.exports = router;
