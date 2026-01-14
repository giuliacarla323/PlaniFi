const supabase = require("../config/supabaseClient");

const signup = async (req, res) => {
    const { email, password, confirmPassword, username } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
    }

    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (existingUser) {
        return res.status(400).json({ error: "There is already an account with this email!" });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }

    if (!authData?.user) {
        return res.status(500).json({ error: "Authentication error!" });
    }

    const { error: insertError } = await supabase
        .from("users")
        .insert([{ username, email }]);

    if (insertError) {
        return res.status(500).json({ error: "Error saving the user!" });
    }

    res.json({ message: "✅ User successfully created! Please confirm your email before login!" });
};



const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return res.status(401).json({ error: "Incorrect email or password!" });
        }

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, email")
            .eq("email", email)
            .single();

        if (userError) {
            return res.status(500).json({ error: "User profile data not found!" });
        }

        return res.json({
            success: true,
            message: "✅ Authentication successful!",
            user: {
                id: userData.id,
                email: userData.email,
                username: userData.username
            }
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error during authentication!" });
    }
};






module.exports = {
    login,
    signup,

};
