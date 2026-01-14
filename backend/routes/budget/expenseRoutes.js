const express = require('express');
const router = express.Router();

const {
    createExpense,
    fetchExpenses,
    editExpense,
    removeExpense
} = require('../../controllers/budget/expenseController');

router.post('/', createExpense);
router.get('/', fetchExpenses);
router.put('/:id', editExpense);
router.delete('/:id', removeExpense);

module.exports = router;
