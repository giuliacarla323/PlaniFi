const {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome
} = require('../../services/budget/incomeService');

const { validateIncome } = require('../../models/budget/incomeModel');

async function createIncome(req, res) {
    const validation = validateIncome(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await addIncome(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchIncomes(req, res) {
    const { budget_plan_id } = req.query;
    if (!budget_plan_id) return res.status(400).json({ error: "Parametru lipsă: budget_plan_id" });

    try {
        const data = await getIncomes(budget_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editIncome(req, res) {
    const { id } = req.params;
    const validation = validateIncome(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateIncome(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeIncome(req, res) {
    const { id } = req.params;

    try {
        await deleteIncome(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createIncome,
    fetchIncomes,
    editIncome,
    removeIncome
};
