// dailyPlanService.js

const supabase = require('../config/supabaseClient');

async function createDailyPlan(plan) {
    const { data, error } = await supabase
        .from('DailyPlans')
        .insert([plan])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function getDailyPlans(userId, date) {
    const { data, error } = await supabase
        .from('DailyPlans')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);

    if (error) throw new Error(error.message);
    return data;
}

module.exports = { createDailyPlan, getDailyPlans };
