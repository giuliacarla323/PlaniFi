const express = require('express');


const router = express.Router();
const {
    addBudget,
    fetchBudget,
    editBudget,
    removeBudget
} = require("../../controllers/budget/budgetController");

router.post("/", addBudget);
router.get("/", fetchBudget);
router.put("/:id", editBudget);
router.delete("/:id", removeBudget);

module.exports=router;