const express = require('express');
const router = express.Router();
const loginController = require('../controllers/user.controller');

router.post('/', loginController.login);

module.exports = router;