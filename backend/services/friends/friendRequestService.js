const supabase = require('../../config/supabaseClient');

// ▶️ Trimitere cerere
async function sendFriendRequest(sender_id, receiver_id) {
    const { data, error } = await supabase
        .from('friend_requests')
        .insert([{ sender_id, receiver_id }])
        .select();

    if (error) throw new Error(error.message);
    return data[0];
}

// 📥 Cereri primite
async function getReceivedRequests(userId) {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('id, sender_id, users:sender_id (id, username, email)')
        .eq('receiver_id', userId)
        .eq('status', 'pending');

    if (error) throw new Error(error.message);
    return data;
}

// ✅ Acceptă cerere
async function acceptRequest(requestId) {
    // 1. Găsește cererea
    const { data: request, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (error || !request) throw new Error("Request not found");

    // 2. Creează relație de prietenie (bidirecțional)
    const { error: friendError } = await supabase
        .from('friends')
        .insert([
            { user_id: request.sender_id, friend_id: request.receiver_id },
            { user_id: request.receiver_id, friend_id: request.sender_id }
        ]);

    if (friendError) throw new Error(friendError.message);

    // 3. Actualizează cererea
    const { error: statusError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

    if (statusError) throw new Error(statusError.message);
}

// ❌ Refuză cerere
async function declineRequest(requestId) {
    const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

    if (error) throw new Error(error.message);
}

module.exports = {
    sendFriendRequest,
    getReceivedRequests,
    acceptRequest,
    declineRequest
};
