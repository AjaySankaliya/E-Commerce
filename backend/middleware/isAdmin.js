const User = require("../models/userModel");
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.id);
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = { isAdmin };
