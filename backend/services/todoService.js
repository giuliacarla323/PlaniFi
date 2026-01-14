const supabase = require('../config/supabaseClient');

async function createTodo(item) {
    const { data, error } = await supabase
        .from('Todos')
        .insert([item])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getTodosByPlan(planId) {
    const { data, error } = await supabase
        .from('Todos')
        .select('*')
        .eq('daily_plan_id', planId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

async function updateTodo(id, updatedItem) {
    const { data, error } = await supabase
        .from('Todos')
        .update(updatedItem)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteTodo(id) {
    const { error } = await supabase
        .from('Todos')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = { createTodo, getTodosByPlan, updateTodo, deleteTodo };
