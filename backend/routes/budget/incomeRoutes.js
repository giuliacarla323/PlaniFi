const express = require('express');
const router = express.Router();

const {
    createIncome,
    fetchIncomes,
    editIncome,
    removeIncome
} = require('../../controllers/budget/incomeController');

router.post('/', createIncome);
router.get('/', fetchIncomes);
router.put('/:id', editIncome);
router.delete('/:id', removeIncome);

module.exports = router;
