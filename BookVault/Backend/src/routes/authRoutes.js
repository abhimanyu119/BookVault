const express = require("express");
const {
  signup,
  login,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);
router.post("/delete-account", verifyToken, deleteAccount);

module.exports = router;
