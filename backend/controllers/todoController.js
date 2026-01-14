const { createTodo, getTodosByPlan, updateTodo, deleteTodo } = require('../services/todoService');
const { validateTodo } = require('../models/todoModel');

async function addTodo(req, res) {
    const validation = validateTodo(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await createTodo(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchTodos(req, res) {
    const { daily_plan_id } = req.query;

    if (!daily_plan_id) return res.status(400).json({ error: "Parametru lipsă: daily_plan_id" });

    try {
        const data = await getTodosByPlan(daily_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editTodo(req, res) {
    const { id } = req.params;
    const validation = validateTodo(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateTodo(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeTodo(req, res) {
    const { id } = req.params;

    try {
        await deleteTodo(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addTodo, fetchTodos, editTodo, removeTodo };
