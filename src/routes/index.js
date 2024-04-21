const express = require('express');
const router = express.Router();

const loginRoutes = require('./login.route');
const signupRoutes = require('./signup.route');

router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);


module.exports = router;