function validateIncome(data) {
    if (!data.budget_plan_id || typeof data.amount !== 'number') {
        return { valid: false, error: "budget_plan_id și amount numeric sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateIncome };
