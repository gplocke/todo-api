const Todo = require('./todo.controller');
const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authorize');

router.get('/', authorize, Todo.list);
router.get('/:id', authorize, Todo.details);
router.post('/', authorize, Todo.create);
router.put('/:id', authorize, Todo.replace);
router.delete('/:id', authorize, Todo.delete);

module.exports = router;