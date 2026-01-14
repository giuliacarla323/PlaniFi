const supabase = require('../../config/supabaseClient');

async function createBudgetPlan(plan) {
    const { data, error } = await supabase
        .from('budget_plans')
        .insert([plan])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getBudgetPlan(userId, month) {
    const { data, error } = await supabase
        .from('budget_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month);

    if (error) throw new Error(error.message);
    return data;
}

module.exports = { createBudgetPlan, getBudgetPlan };
