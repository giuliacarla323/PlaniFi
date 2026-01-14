const { createCall, getCallByPlan, updateCall, deleteCall } = require('../services/callService');
const { validateCall } = require('../models/callModel');

async function addCall(req, res) {
    const validation = validateCall(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await createCall(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchCall(req, res) {
    const { daily_plan_id } = req.query;

    if (!daily_plan_id) return res.status(400).json({ error: "Parametru lipsă: daily_plan_id" });

    try {
        const data = await getCallByPlan(daily_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editCall(req, res) {
    const { id } = req.params;
    const validation = validateCall(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateCall(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeCall(req, res) {
    const { id } = req.params;

    try {
        await deleteCall(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addCall, fetchCall, editCall, removeCall };
