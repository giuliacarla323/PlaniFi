const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');

router.post('/', scheduleController.addScheduleItem);
router.get('/', scheduleController.fetchScheduleItems);
router.put('/:id', scheduleController.editScheduleItem);
router.delete('/:id', scheduleController.removeScheduleItem);


module.exports = router;
