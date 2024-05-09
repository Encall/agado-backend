const passport = require('passport');
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { authLoginSchema, authSignupSchema } = require('../schemas/index.schema');
const { validateBody } = require('../middlewares/index.middleware');

router.post('/signup',validateBody(authSignupSchema), authController.signup);
router.post('/login', validateBody(authLoginSchema), authController.login);
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
