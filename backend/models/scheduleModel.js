function validateScheduleItem(data) {
    if (!data.daily_plan_id || !data.hour || !data.title) {
        return { valid: false, error: "daily_plan_id, hour și title sunt obligatorii!" };
    }
    return { valid: true };
}

module.exports = { validateScheduleItem };
