const express = require('express');
const router = express.Router();

const callController = require('../controllers/callController');

router.post('/', callController.addCall);
router.get('/', callController.fetchCall);
router.put('/:id', callController.editCall);
router.delete('/:id', callController.removeCall);

module.exports = router;
