const Auth = require('./auth.controller');
const express = require('express');
var router = express.Router();

router.post('/signup', Auth.signup);
router.post('/login', Auth.login);

module.exports = router;