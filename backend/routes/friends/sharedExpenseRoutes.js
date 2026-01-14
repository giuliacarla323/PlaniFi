const express = require('express');
const router = express.Router();
const {
    createExpense,
    listExpenses,
    listGroupExpenses,
    settle,
    updateExpenseController,
    deleteExpenseController
} = require('../../controllers/friends/sharedExpenseController');

//app.use('/api/shared-expenses', sharedExpenseRoutes);

// 🔄 Creează o cheltuială comună (individuală sau de grup)
router.post('/', createExpense);

// 📋 Listează cheltuielile utilizatorului (individuale și de grup)
router.get('/user/:user_id', listExpenses);

// 📋 Listează cheltuielile pentru un grup
router.get('/group/:group_id', listGroupExpenses);

// ✅ Marchează o cheltuială ca achitată
router.post('/:expense_id/settle', settle);
// 🔄 Actualizează o cheltuială (doar dacă nu e settled)
router.put('/:expense_id', updateExpenseController);

// ❌ Șterge o cheltuială (doar dacă nu e settled)
router.delete('/:expense_id', deleteExpenseController);

module.exports = router;
