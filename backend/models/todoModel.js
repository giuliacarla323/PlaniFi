function validateTodo(data) {
    if (!data.daily_plan_id || !data.task) {
        return { valid: false, error: "daily_plan_id și task sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateTodo };
