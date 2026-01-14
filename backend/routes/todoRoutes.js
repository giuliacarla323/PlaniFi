const express = require('express');
const router = express.Router();

const todosController = require('../controllers/todoController');

router.post('/', todosController.addTodo);
router.get('/', todosController.fetchTodos);
router.put('/:id', todosController.editTodo);
router.delete('/:id', todosController.removeTodo);

module.exports = router;
