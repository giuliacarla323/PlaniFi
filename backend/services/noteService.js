const supabase = require('../config/supabaseClient');

async function getNoteByPlanId(planId) {
    const { data, error } = await supabase
        .from('Notes')
        .select('*')
        .eq('daily_plan_id', planId)
        .limit(1)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
}

async function createNote(note) {
    const { data, error } = await supabase
        .from('Notes')
        .insert([note])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

async function updateNote(id, updatedFields) {
    const { data, error } = await supabase
        .from('Notes')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

module.exports = {
    getNoteByPlanId,
    createNote,
    updateNote,
};
