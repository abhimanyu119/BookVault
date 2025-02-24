const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

console.log(authenticate);
const router = express.Router();

router.get("/profile", authenticate, getUserProfile);

module.exports = router;