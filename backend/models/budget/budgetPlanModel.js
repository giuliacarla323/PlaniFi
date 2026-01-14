function validateBudgetPlan(data) {
    if (!data.user_id || !data.month) {
        return { valid: false, error: "user_id și month sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateBudgetPlan };
