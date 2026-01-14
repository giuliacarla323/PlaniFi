const {
    createGroup,
    addGroupMember,
    removeGroupMember,
    getGroupMembers,
    getGroupsForUser
} = require('../../services/friends/groupService');

// Creează grup
async function handleCreateGroup(req, res) {
    const { name, created_by } = req.body;

    if (!name || !created_by) {
        return res.status(400).json({ error: 'Lipsesc câmpuri: name, created_by' });
    }

    try {
        const group = await createGroup(name, created_by);
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Adaugă membru
async function handleAddMember(req, res) {
    const { group_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'Lipsă user_id în body' });
    }

    try {
        const member = await addGroupMember(group_id, user_id);
        res.status(201).json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Șterge membru
async function handleRemoveMember(req, res) {
    const { group_id, user_id } = req.params;

    try {
        await removeGroupMember(group_id, user_id);
        res.json({ message: 'Membru șters din grup' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Listează membri
async function handleGetMembers(req, res) {
    const { group_id } = req.params;

    try {
        const members = await getGroupMembers(group_id);
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function handleGetGroupsForUser(req, res) {
    const { user_id } = req.params;

    try {
        const groups = await getGroupsForUser(user_id);
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
    handleCreateGroup,
    handleAddMember,
    handleRemoveMember,
    handleGetMembers,
    handleGetGroupsForUser
};
