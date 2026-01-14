function validateSharedExpense(data) {
    if (
        !data.sender_id ||
        !data.receiver_id ||
        typeof data.amount !== 'number' ||
        !data.description
    ) {
        return { valid: false, error: 'Toate câmpurile (sender_id, receiver_id, amount, description) sunt necesare și corect tipate.' };
    }

    if (data.amount <= 0) {
        return { valid: false, error: 'Suma trebuie să fie mai mare decât 0.' };
    }

    return { valid: true };
}

module.exports = { validateSharedExpense };
