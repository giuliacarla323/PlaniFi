function validateFriendRequest(data) {
    if (!data.sender_id || !data.receiver_id) {
        return { valid: false, error: 'sender_id și receiver_id sunt obligatorii!' };
    }

    if (data.sender_id === data.receiver_id) {
        return { valid: false, error: 'Nu poți trimite cerere către tine însuți!' };
    }

    return { valid: true };
}

module.exports = { validateFriendRequest };
