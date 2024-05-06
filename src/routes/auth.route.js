const passport = require('passport');
const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
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

router.get(
    '/user/status',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.status(200).send();
    }
);

module.exports = router;
