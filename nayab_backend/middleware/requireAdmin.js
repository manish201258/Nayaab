const User = require("../models/user");

async function requireAdmin(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Not authorized as admin." });
  }
  next();
}

module.exports = requireAdmin; 