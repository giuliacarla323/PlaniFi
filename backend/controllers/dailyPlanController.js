// dailyPlanController.js

const { createDailyPlan, getDailyPlans } = require('../services/dailyPlanService');
const { validateDailyPlan } = require('../models/dailyPlanModel');

async function addDailyPlan(req, res) {
    const validation = validateDailyPlan(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await createDailyPlan(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchDailyPlans(req, res) {
    const { user_id, date } = req.query;

    if (!user_id || !date) return res.status(400).json({ error: "Parametrii lipsă!" });

    try {
        const data = await getDailyPlans(user_id, date);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addDailyPlan, fetchDailyPlans };
