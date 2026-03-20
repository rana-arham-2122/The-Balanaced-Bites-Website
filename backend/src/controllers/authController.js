const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signAccess  = (id) => jwt.sign({ id }, process.env.JWT_SECRET,         { expiresIn: "1h"  });
const signRefresh = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET,  { expiresIn: "7d"  });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password required." });

    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: "Email already registered." });

    const user = await User.create({ name, email, password });
    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);
    user.refreshToken  = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      accessToken, refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isOnboarded: user.isOnboarded },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);
    user.refreshToken  = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      accessToken, refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isOnboarded: user.isOnboarded, profile: user.profile },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: req.body, isOnboarded: true },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token." });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ success: false, message: "Invalid refresh token." });

    const newAccess  = signAccess(user._id);
    const newRefresh = signRefresh(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, accessToken: newAccess, refreshToken: newRefresh });
  } catch { res.status(401).json({ success: false, message: "Refresh token invalid or expired." }); }
};

exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.status(200).json({ success: true, message: "Logged out." });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
