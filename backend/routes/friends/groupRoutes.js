const express = require('express');
const router = express.Router();
const {
    handleCreateGroup,
    handleAddMember,
    handleRemoveMember,
    handleGetMembers,
    handleGetGroupsForUser
} = require('../../controllers/friends/groupController');

// Creează un grup
router.post('/', handleCreateGroup);

// Adaugă membru
router.post('/:group_id/members', handleAddMember);

// Șterge membru
router.delete('/:group_id/members/:user_id', handleRemoveMember);

// Listează membrii
router.get('/:group_id/members', handleGetMembers);
// Listează grupurile unui user
router.get('/for-user/:user_id', handleGetGroupsForUser);


module.exports = router;
