const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Token have invalid or expired",
    });
  }
  const decoded = await jwt.verify(auth, process.env.SECRET_KEY);
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User have not found",
    });
  }
  req.id = user._id;
  next();
};

module.exports = { isAuthenticated };
