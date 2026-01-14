const express = require('express');
const router = express.Router();

const {
    addBudgetPlan,
    fetchBudgetPlan,
    getBudgetOverview
} = require('../../controllers/budget/budgetPlanController');

// Adaugă un nou plan de buget
router.post('/', addBudgetPlan);

// Obține un plan de buget pentru un utilizator și o lună
router.get('/', fetchBudgetPlan);
router.get('/overview', getBudgetOverview);

module.exports = router;
