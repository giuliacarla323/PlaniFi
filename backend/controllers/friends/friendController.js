const { getFriends, deleteFriend } = require('../../services/friends/friendService');

async function listFriends(req, res) {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "Parametru lipsă: user_id" });

    try {
        const friends = await getFriends(user_id);
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeFriend(req, res) {
    const { user_id, friend_id } = req.body;
    if (!user_id || !friend_id) return res.status(400).json({ error: "user_id și friend_id sunt necesare" });

    try {
        await deleteFriend(user_id, friend_id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const { searchUsersByEmail } = require('../../services/friends/friendService');

async function searchUsers(req, res) {
    const { query, current_user_id } = req.query;

    if (!query || !current_user_id) {
        return res.status(400).json({ error: "Parametrii lipsă: query și current_user_id" });
    }

    try {
        const users = await searchUsersByEmail(query, parseInt(current_user_id));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
    listFriends,
    removeFriend,
    searchUsers
};
