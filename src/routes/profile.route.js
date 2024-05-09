const router = require('express').Router();
const passport = require('passport');
const profileController = require('../controllers/profile.controller');

// GET /profile (get user profile from JWT.user.userid)
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    profileController.getUserProfile
);

// POST /profile/edit
router.post(
    '/edit',
    passport.authenticate('jwt', { session: false }),
    profileController.editUserProfile
);

module.exports = router;
