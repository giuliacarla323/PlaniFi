const supabase = require('../../config/supabaseClient');

async function deleteFriend(userId, friendId) {
    const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (error) throw new Error(error.message);
}
async function getFriends(userId) {
    const { data, error } = await supabase
        .from('friends')
        .select('friend_id, users!friends_friend_id_fkey(id, username, email)')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);

    return data.map(f => f.users);
}

async function searchUsersByEmail(query, currentUserId) {
    const { data: allMatches, error } = await supabase
        .from('users')
        .select('id, email, username')
        .ilike('email', `%${query}%`) // case-insensitive
        .neq('id', currentUserId);    // exclude self

    if (error) throw new Error(error.message);

    // 1. Get already-friends
    const { data: friends } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', currentUserId);

    const friendIds = friends?.map(f => f.friend_id) || [];

    // 2. Filter out friends
    return allMatches.filter(u => !friendIds.includes(u.id));
}


module.exports={deleteFriend,getFriends,searchUsersByEmail};