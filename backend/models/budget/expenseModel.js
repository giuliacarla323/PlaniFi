function validateExpense(data) {
    if (!data.budget_plan_id || typeof data.amount !== 'number' || !data.category) {
        return { valid: false, error: "budget_plan_id, amount numeric și category sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateExpense };
