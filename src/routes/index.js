const express = require('express');
const router = express.Router();

const loginRoutes = require('./login.route');
const signupRoutes = require('./signup.route');
const passport = require('passport');

router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);

router.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Protected route' });
    }
);

module.exports = router;
