const supabase = require('../../config/supabaseClient');

// Creează un nou grup
async function createGroup(name, created_by) {
    const { data, error } = await supabase
        .from('groups')
        .insert({ name, created_by })
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Adaugă automat creatorul în membri
    const memberInsert = await supabase
        .from('group_members')
        .insert({ group_id: data.id, user_id: created_by });

    if (memberInsert.error) throw new Error(memberInsert.error.message);

    return data;
}

// Adaugă un membru într-un grup
async function addGroupMember(group_id, user_id) {
    const { data, error } = await supabase
        .from('group_members')
        .insert({ group_id, user_id })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// Șterge un membru dintr-un grup
async function removeGroupMember(group_id, user_id) {
    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group_id)
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);
}

// Obține membrii unui grup
async function getGroupMembers(group_id) {
    const { data, error } = await supabase
        .from('group_members')
        .select(`
            id,
            user:user_id (id, username, email)
        `)
        .eq('group_id', group_id);

    if (error) throw new Error(error.message);
    return data;
}
// Obține toate grupurile în care participă un utilizator
// Obține toate grupurile unui user
async function getGroupsForUser(user_id) {
    const { data, error } = await supabase
        .from('groups')
        .select(`
            id,
            name,
            created_by,
            group_members!inner(user_id)
        `)
        .eq('group_members.user_id', user_id);

    if (error) throw new Error(error.message);
    return data;
}



module.exports = {
    createGroup,
    addGroupMember,
    removeGroupMember,
    getGroupMembers,
    getGroupsForUser
};
