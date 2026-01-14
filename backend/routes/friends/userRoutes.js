const express = require('express');
const router = express.Router();
const { findUserByEmail } = require('../../controllers/friends/userController');

router.get('/find-by-email', findUserByEmail); // 👈 adaugă această rută

module.exports = router;
