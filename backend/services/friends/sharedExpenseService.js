const supabase = require('../../config/supabaseClient');

// ➕ Creează o cheltuială (individuală sau în grup)
async function createSharedExpense(expense) {
    const { data, error } = await supabase
        .from('shared_expenses')
        .insert([expense])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// 🔍 Lista cheltuieli pentru un utilizator (ca plătitor sau beneficiar)
async function getExpensesForUser(user_id) {
    const { data, error } = await supabase
        .from('shared_expenses')
        .select(`
            *,
            payer:payer_id (id, username, email),
            owned:owned_id (id, username, email),
            group:group_id (id, name)
        `)
        .or(`payer_id.eq.${user_id},owned_id.eq.${user_id}`)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

// 🔍 Lista cheltuieli pentru un grup
async function getExpensesForGroup(group_id) {
    const { data, error } = await supabase
        .from('shared_expenses')
        .select(`
            *,
            payer:payer_id (id, username, email),
            owned:owned_id (id, username, email),
            group:group_id (id, name)
        `)
        .eq('group_id', group_id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

// ✅ Marchează ca achitat
async function settleExpense(expense_id) {
    const { error } = await supabase
        .from('shared_expenses')
        .update({ settled: true })
        .eq('id', expense_id);

    if (error) throw new Error(error.message);
}

// 🔄 Editează o cheltuială (doar dacă nu e settled)
async function updateExpense(id, updateFields) {
    const { data, error } = await supabase
        .from('shared_expenses')
        .update(updateFields)
        .eq('id', id)
        .eq('settled', false)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// ❌ Șterge o cheltuială (doar dacă nu e settled)
async function deleteExpense(id) {
    const { error } = await supabase
        .from('shared_expenses')
        .delete()
        .eq('id', id)
        .eq('settled', false);

    if (error) throw new Error(error.message);
}

module.exports = {
    createSharedExpense,
    getExpensesForUser,
    getExpensesForGroup,
    settleExpense,
    updateExpense,
    deleteExpense
};
