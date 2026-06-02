const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/dashboard", requireAuth, requireAdmin, getDashboardSummary);

module.exports = router;
