const { createScheduleItem, getScheduleItemsByPlan ,updateScheduleItem, deleteScheduleItem} = require('../services/scheduleService');
const { validateScheduleItem } = require('../models/scheduleModel');

async function addScheduleItem(req, res) {
    const validation = validateScheduleItem(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await createScheduleItem(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchScheduleItems(req, res) {
    const { daily_plan_id } = req.query;

    if (!daily_plan_id) return res.status(400).json({ error: "Parametru lipsă: daily_plan_id" });

    try {
        const data = await getScheduleItemsByPlan(daily_plan_id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editScheduleItem(req, res) {
    const { id } = req.params;
    const validation = validateScheduleItem(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const data = await updateScheduleItem(id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeScheduleItem(req, res) {
    const { id } = req.params;

    try {
        await deleteScheduleItem(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { addScheduleItem, fetchScheduleItems ,editScheduleItem,removeScheduleItem};
