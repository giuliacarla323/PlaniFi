const {
    sendFriendRequest,
    getReceivedRequests,
    acceptRequest,
    declineRequest
} = require('../../services/friends/friendRequestService');

// ▶️ Trimitere cerere
async function sendRequest(req, res) {
    const { sender_id, receiver_id } = req.body;
    if (!sender_id || !receiver_id) return res.status(400).json({ error: 'Sender și receiver sunt necesari' });

    try {
        const result = await sendFriendRequest(sender_id, receiver_id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 📥 Cereri primite
async function getRequests(req, res) {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'Parametru lipsă: user_id' });

    try {
        const requests = await getReceivedRequests(user_id);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ✅ Acceptă
async function accept(req, res) {
    try {
        await acceptRequest(req.params.id);
        res.status(200).json({ message: 'Accepted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ❌ Refuză
async function decline(req, res) {
    try {
        await declineRequest(req.params.id);
        res.status(200).json({ message: 'Declined' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    sendRequest,
    getRequests,
    accept,
    decline
};
