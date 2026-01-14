function validateBudget(data) {
    if (!data.budget_plan_id || data.amount === undefined || data.amount === null || !data.category) {

        return { valid: false, error: "budget_plan_id, amount și category sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateBudget };
