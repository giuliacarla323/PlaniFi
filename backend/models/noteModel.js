function validateNote(data) {
    if (!data.daily_plan_id) {
        return { valid: false, error: "daily_plan_id este obligatoriu!" };
    }
    return { valid: true };
}

module.exports = { validateNote };
