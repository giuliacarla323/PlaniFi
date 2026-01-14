const supabase = require('../../config/supabaseClient');

async function addExpense(expense) {
    const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getExpenses(budgetPlanId) {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('budget_plan_id', budgetPlanId);

    if (error) throw new Error(error.message);
    return data;
}

async function updateExpense(id, updatedExpense) {
    const { data, error } = await supabase
        .from('expenses')
        .update(updatedExpense)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteExpense(id) {
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};
