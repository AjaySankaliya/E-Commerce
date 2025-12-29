const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyEmail = require("../services/emailVerify");
const Session = require("../models/sessionModel");
const sendOtpEmail = require("../services/sendOtpEmail");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User have already register",
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
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User register successfully",
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
      message: "token is invalid or expired",
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
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Verify your account before login",
    });
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_KEY,
    { expiresIn: "10d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_KEY,
    { expiresIn: "20d" }
  );

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
    user,
  });
};


const logout = async (req, res) => {
  const userId = req.id;
  await Session.deleteMany({ UserId: userId });
  await User.findByIdAndUpdate(userId, { isLoggedIn: false });
  return res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user have not found",
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
        message: "user have not found",
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
    }
    else
    {
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
        message: "user have not found",
      });
    }
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm new password must be same",
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


module.exports = {
  register,
  verify,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  changePassword,
  getAllUser,
};
