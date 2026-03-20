const User     = require("../models/User");
const Recipe   = require("../models/Recipe");
const MealPlan = require("../models/MealPlan");

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalRecipes, totalPlans, recentUsers] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      MealPlan.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt isOnboarded"),
    ]);
    res.status(200).json({ success: true, stats: { totalUsers, totalRecipes, totalPlans }, recentUsers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-refreshToken");
    res.status(200).json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
