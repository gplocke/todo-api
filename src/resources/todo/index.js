const Todo = require('./todo.controller');
const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authorize');
const validateObjectId = require('../../middleware/validateObjectId');

router.get('/', authorize, Todo.list);
router.get('/:id', authorize, validateObjectId, Todo.details);
router.post('/', authorize, Todo.create);
router.put('/:id', authorize, validateObjectId, Todo.replace);
router.delete('/:id', authorize, validateObjectId, Todo.delete);

module.exports = router;