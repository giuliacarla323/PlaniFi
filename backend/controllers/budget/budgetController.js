const {
    setBudget,
    getBudgetsByPlan,
    updateBudget,
    deleteBudget
} = require('../../services/budget/budgetService');

const { validateBudget } = require('../../models/budget/budgetModel');

async function addBudget(req, res) {
    const validation = validateBudget(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await setBudget(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchBudget(req, res) {
    const { budget_plan_id } = req.query;
    if (!budget_plan_id) return res.status(400).json({ error: "Parametru lipsă: budget_plan_id" });

    try {
        const data = await getBudgetsByPlan(budget_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editBudget(req, res) {
    const { id } = req.params;
    const validation = validateBudget(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateBudget(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeBudget(req, res) {
    const { id } = req.params;

    try {
        await deleteBudget(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addBudget,
    fetchBudget,
    editBudget,
    removeBudget
};
