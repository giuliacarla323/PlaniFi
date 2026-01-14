function validateCall(data) {
    if (!data.daily_plan_id || !data.text) {
        return { valid: false, error: "daily_plan_id și text sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateCall };
