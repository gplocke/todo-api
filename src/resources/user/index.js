const User = require('./user.controller');
const express = require('express');
var router = express.Router();
const authorize = require('../../middleware/authorize');

router.get('/', authorize, User.list);
router.get('/me', authorize, User.me);
router.get('/:id', authorize, User.details);
router.put('/:id', authorize, User.replace);
router.delete('/:id', authorize, User.delete);

module.exports = router;