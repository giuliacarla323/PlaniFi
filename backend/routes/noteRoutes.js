const express = require('express');
const router = express.Router();

const NoteController = require('../controllers/noteController');

router.get('/', NoteController.getNote);         // ?daily_plan_id=123
router.post('/', NoteController.addNote);     // body: { daily_plan_id, note_text }
router.put('/:id', NoteController.editNote);   // body: { note_text }

module.exports = router;
