const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");



const { signup, login} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password" // pagina ta de frontend
    });

    if (error) {
        console.error("❌ Password reset error!:", error.message);
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "📧 Password reset email sent successfully!" });
});



module.exports = router;