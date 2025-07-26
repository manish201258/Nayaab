const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const tokenGenerate = require("../jwtGenerate");
const { updateLastLogin } = require("./userController");
const mailer = require("../../lib/mailer");

// Admin login function
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "Your account has been deleted. Please contact admin." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await updateLastLogin(user._id);
    await mailer.sendMail({
      to: user.email,
      subject: "Login Alert - Nayab co.",
      html: `<div style='font-family:sans-serif;'>
        <h2>Login Alert</h2>
        <p>Hello <b>${user.name}</b>,</p>
        <p>Your account was just logged in to Nayab co. If this was not you, please reset your password or contact support immediately.</p>
        <p style='color:#B8956A;'>Nayab co. Team</p>
      </div>`,
      text: `Hello ${user.name},\nYour account was just logged in to Nayab co. If this was not you, please reset your password or contact support.\nNayab co. Team`
    });

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin
      },
      token: tokenGenerate(user._id)
    });
  } catch (error) {
    console.error("Admin Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { login }; 