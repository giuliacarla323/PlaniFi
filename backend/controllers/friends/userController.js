const supabase = require('../../config/supabaseClient');

async function findUserByEmail(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Parametru lipsă: email' });

    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error) return res.status(404).json({ error: 'User not found' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    findUserByEmail
};
