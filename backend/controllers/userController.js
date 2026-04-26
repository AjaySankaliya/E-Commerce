const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyEmail = require("../services/emailVerify");
const Session = require("../models/sessionModel");
const sendOtpEmail = require("../services/sendOtpEmail");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    const token = await jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    verifyEmail(token, email);
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      err: error,
    });
  }
};

const verify = async (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
  try {
    const decoded = await jwt.verify(auth, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      err: error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account before logging in",
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "10d",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "20d",
  });

  const existsSession = await Session.findOne({ UserId: user._id });
  if (existsSession) {
    await Session.deleteOne({ UserId: user._id });
  }

  user.isLoggedIn = true;
  await user.save();
  await Session.create({ UserId: user._id });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

  return res.status(200).json({
    success: true,
    message: `Welcome back ${user.firstName}`,
    accessToken,
    refreshToken,
    user,
  });
};

const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ UserId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

    return res.status(200).json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  sendOtpEmail(otp, email);

  return res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.otp === otp && user.otpExpiry > Date.now()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or OTP expired",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      err: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      err: error,
    });
  }
};

const getAllUser = async (req, res) => {
  {
    try {
      const users = await User.find();
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
        err: error,
      });
    }
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedUserId = req.params.userId;
    const loggedInUser = req.user;

    const { firstName, lastName, phoneNo, address, city, zipCode } = req.body;

    if (
      loggedInUser._id.toString() !== updatedUserId.toString() &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile",
      });
    }

    const user = await User.findById(updatedUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let profilePic = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile",
      });

      profilePic = result.secure_url;
      profilePicPublicId = result.public_id;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.profilePic = profilePic;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      err: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token missing" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    const newAccessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    // Set cookie just in case
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("Refresh Token Error:", error.message);
    return res.status(401).json({ success: false, message: "Refresh token expired" });
  }
};

module.exports = {
  register,
  verify,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  changePassword,
  getAllUser,
  updateUserProfile,
  refreshToken,
};
