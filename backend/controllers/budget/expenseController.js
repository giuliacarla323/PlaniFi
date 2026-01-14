const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require('../../services/budget/expenseService');

const { validateExpense } = require('../../models/budget/expenseModel');

async function createExpense(req, res) {
    const validation = validateExpense(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await addExpense(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchExpenses(req, res) {
    const { budget_plan_id } = req.query;
    if (!budget_plan_id) return res.status(400).json({ error: "Parametru lipsă: budget_plan_id" });

    try {
        const data = await getExpenses(budget_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editExpense(req, res) {
    const { id } = req.params;
    const validation = validateExpense(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateExpense(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeExpense(req, res) {
    const { id } = req.params;

    try {
        await deleteExpense(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createExpense,
    fetchExpenses,
    editExpense,
    removeExpense
};
