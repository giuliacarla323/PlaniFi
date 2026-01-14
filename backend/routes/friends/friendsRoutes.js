const express = require('express');
const router = express.Router();
const { listFriends, removeFriend,searchUsers } = require('../../controllers/friends/friendController');

router.get('/', listFriends);       // /api/friends?user_id=123
router.delete('/', removeFriend);   // /api/friends { user_id, friend_id }
router.get('/search', searchUsers); // /api/friends/search?query=ana&current_user_id=1


module.exports = router;
