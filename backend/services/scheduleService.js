const supabase = require('../config/supabaseClient');

async function createScheduleItem(item) {
    const { data, error } = await supabase
        .from('ScheduleItems')
        .insert([item])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getScheduleItemsByPlan(planId) {
    const { data, error } = await supabase
        .from('ScheduleItems')
        .select('*')
        .eq('daily_plan_id', planId)
        .order('hour', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

async function updateScheduleItem(id, updatedItem) {
    const { data, error } = await supabase
        .from('ScheduleItems')
        .update(updatedItem)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteScheduleItem(id) {
    const { error } = await supabase
        .from('ScheduleItems')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = {createScheduleItem, getScheduleItemsByPlan,updateScheduleItem,deleteScheduleItem};