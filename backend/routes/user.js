const express = require('express');
const router = express.Router();
const userCtrl = require('../controlers/user');
const { validateSignup, validateLogin } = require('../middleware/email')

router.post('/signup', validateSignup, userCtrl.signup);
router.post('/login', validateLogin, userCtrl.login);

module.exports = router