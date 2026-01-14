const { createBudgetPlan, getBudgetPlan } = require('../../services/budget/budgetPlanService');
const { validateBudgetPlan } = require('../../models/budget/budgetPlanModel');
const { getBudgetsByPlan } = require('../../services/budget/budgetService');
const { getExpenses } = require('../../services/budget/expenseService');
const { getIncomes } = require('../../services/budget/incomeService');


async function addBudgetPlan(req, res) {
    const validation = validateBudgetPlan(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await createBudgetPlan(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchBudgetPlan(req, res) {
    const { user_id, month } = req.query;
    if (!user_id || !month) return res.status(400).json({ error: "Parametrii lipsă!" });

    try {
        const data = await getBudgetPlan(user_id, month);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



async function getBudgetOverview(req, res) {
    const { user_id, month } = req.query;
    if (!user_id || !month) return res.status(400).json({ error: "Parametrii lipsă!" });

    try {
        const [plan] = await getBudgetPlan(user_id, month);
        if (!plan) return res.status(404).json({ error: "Planul nu există" });

        const [incomes, expenses, budgets] = await Promise.all([
            getIncomes(plan.id),
            getExpenses(plan.id),
            getBudgetsByPlan(plan.id)
        ]);

        const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const balance = totalIncome - totalExpenses;

        const spentByCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        res.json({
            plan,
            budgets,
            incomes,
            expenses,
            totalIncome,
            totalExpenses,
            balance,
            spentByCategory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { addBudgetPlan, fetchBudgetPlan,getBudgetOverview };
