// dailyPlanModel.js

function validateDailyPlan(data) {
    if (!data.user_id || !data.date) {
        return { valid: false, error: "user_id și date sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateDailyPlan };
