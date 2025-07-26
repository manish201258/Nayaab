const express = require("express");
const userRouter = express.Router();
const { login, userLogin, register } = require("../../controllers/userController/authController");
const tokenValidate = require("../../middleware/tokenValidate");
const User = require("../../models/user"); // Fixed casing to match other imports

// User login route
userRouter.post('/user-login', userLogin);

// Register route (for users only)
userRouter.post('/register', register);

// Get current user
userRouter.get("/me", tokenValidate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;

