const supabase = require('../../config/supabaseClient');

async function addIncome(income) {
    const { data, error } = await supabase
        .from('incomes')
        .insert([income])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getIncomes(budgetPlanId) {
    const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('budget_plan_id', budgetPlanId);

    if (error) throw new Error(error.message);
    return data;
}

async function updateIncome(id, updatedIncome) {
    const { data, error } = await supabase
        .from('incomes')
        .update(updatedIncome)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function deleteIncome(id) {
    const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

module.exports = {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome
};
