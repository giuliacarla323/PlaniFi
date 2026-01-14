const supabase = require('../config/supabaseClient');

async function getQuoteByDay(day) {
    const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', day)
        .single();

    if (error) throw error;
    return data;
}

module.exports = { getQuoteByDay };
