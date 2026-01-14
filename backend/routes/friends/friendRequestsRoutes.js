const express = require('express');
const router = express.Router();

const {
    sendRequest,
    getRequests,
    accept,
    decline
} = require('../../controllers/friends/friendRequestController');

router.post('/', sendRequest);                    // POST /api/friend-requests
router.get('/', getRequests);                     // GET /api/friend-requests?user_id=2
router.post('/:id/accept', accept);               // POST /api/friend-requests/5/accept
router.post('/:id/decline', decline);             // POST /api/friend-requests/5/decline

module.exports = router;
