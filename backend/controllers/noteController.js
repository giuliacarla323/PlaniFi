const { getNoteByPlanId, createNote, updateNote } = require('../services/noteService');

async function getNote(req, res) {
    try {
        const { daily_plan_id } = req.query;
        if (!daily_plan_id) return res.status(400).json({ error: 'Missing daily_plan_id' });

        const note = await getNoteByPlanId(daily_plan_id);
        res.json(note ? [note] : []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function addNote(req, res) {
    try {
        const note = req.body;
        if (!note.daily_plan_id) return res.status(400).json({ error: 'Missing daily_plan_id' });

        const newNote = await createNote(note);
        res.json([newNote]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function editNote(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id) return res.status(400).json({ error: 'Missing note id' });

        const updated = await updateNote(id, updates);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getNote, addNote, editNote };
