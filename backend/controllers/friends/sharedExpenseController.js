const {
    createSharedExpense,
    getExpensesForUser,
    getExpensesForGroup,
    settleExpense,
    updateExpense,
    deleteExpense
} = require('../../services/friends/sharedExpenseService');

// ✅ Adaugă cheltuială
async function createExpense(req, res) {
    const { title, amount, creator_id, payer_id, owned_id, group_id } = req.body;

    if (!title || !amount || !creator_id || !payer_id || !owned_id) {
        return res.status(400).json({
            error: 'Lipsesc câmpuri necesare: title, amount, creator_id, payer_id, owned_id'
        });
    }

    try {
        const expense = await createSharedExpense({
            title,
            amount,
            creator_id,
            payer_id,
            owned_id,
            group_id: group_id || null
        });
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ✅ Cheltuieli pentru un utilizator
async function listExpenses(req, res) {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ error: 'Parametru lipsă: user_id' });

    try {
        const expenses = await getExpensesForUser(user_id);
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ✅ Cheltuieli pentru un grup
async function listGroupExpenses(req, res) {
    const { group_id } = req.params;
    if (!group_id) return res.status(400).json({ error: 'Parametru lipsă: group_id' });

    try {
        const expenses = await getExpensesForGroup(group_id);
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ✅ Settle
async function settle(req, res) {
    const { expense_id } = req.params;
    if (!expense_id) return res.status(400).json({ error: 'Parametru lipsă: expense_id' });

    try {
        await settleExpense(expense_id);
        res.json({ message: 'Cheltuială marcată ca achitată' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// 🔄 Editează o cheltuială
async function updateExpenseController(req, res) {
    const { expense_id } = req.params;
    const updateFields = req.body;

    if (!expense_id) {
        return res.status(400).json({ error: 'Parametru lipsă: expense_id' });
    }

    try {
        const updatedExpense = await updateExpense(expense_id, updateFields);
        res.json(updatedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ❌ Șterge o cheltuială
async function deleteExpenseController(req, res) {
    const { expense_id } = req.params;

    if (!expense_id) {
        return res.status(400).json({ error: 'Parametru lipsă: expense_id' });
    }

    try {
        await deleteExpense(expense_id);
        res.json({ message: 'Cheltuială ștearsă cu succes' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createExpense,
    listExpenses,
    listGroupExpenses,
    settle,
    updateExpenseController,
    deleteExpenseController
};
