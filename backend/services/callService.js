const supabase = require('../config/supabaseClient');

async function createCall(item) {
    const { data, error } = await supabase
        .from('ContactsToCallOrEmail')
        .insert([item])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getCallByPlan(planId) {
    const { data, error } = await supabase
        .from('ContactsToCallOrEmail')
        .select('*')
        .eq('daily_plan_id', planId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

async function updateCall(id, updatedItem) {
    const { data, error } = await supabase
        .from('ContactsToCallOrEmail')
        .update(updatedItem)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteCall(id) {
    const { error } = await supabase
        .from('ContactsToCallOrEmail')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = { createCall, getCallByPlan, updateCall, deleteCall };
