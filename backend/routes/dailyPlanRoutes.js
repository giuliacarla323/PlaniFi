// dailyPlanRoutes.js

const express = require('express');
const { addDailyPlan, fetchDailyPlans } = require('../controllers/dailyPlanController');

const router = express.Router();

router.post('/', addDailyPlan);         // pentru adăugare plan nou
router.get('/', fetchDailyPlans);       // pentru obținere planuri per zi

module.exports = router;
