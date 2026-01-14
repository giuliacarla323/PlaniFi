const supabase = require('../../config/supabaseClient');

async function setBudget(budget) {
    const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getBudgetsByPlan(planId) {
    const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('budget_plan_id', planId);

    if (error) throw new Error(error.message);
    return data;
}

async function updateBudget(id, updatedBudget) {
    const { data, error } = await supabase
        .from('budgets')
        .update(updatedBudget)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteBudget(id) {
    const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = { setBudget, getBudgetsByPlan, updateBudget, deleteBudget };
