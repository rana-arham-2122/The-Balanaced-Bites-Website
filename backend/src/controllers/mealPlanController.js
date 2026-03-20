const MealPlan = require("../models/MealPlan");
const Recipe   = require("../models/Recipe");

exports.saveMealPlan = async (req, res) => {
  try {
    const { weekStart, slots } = req.body;
    const recipeIds = slots.map(s => s.recipe).filter(Boolean);
    const recipes   = await Recipe.find({ _id: { $in: recipeIds } });

    const ingredientMap = {};
    recipes.forEach(r => {
      (r.ingredients || []).forEach(ing => {
        const key = ing.name?.toLowerCase();
        if (key) ingredientMap[key] = { name: ing.name, amount: ing.amount, category: "General", checked: false };
      });
    });

    const plan = await MealPlan.findOneAndUpdate(
      { userId: req.user._id, weekStart: new Date(weekStart) },
      { userId: req.user._id, weekStart: new Date(weekStart), slots, groceryList: Object.values(ingredientMap) },
      { upsert: true, new: true }
    ).populate("slots.recipe");

    res.status(200).json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMealPlan = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised." });

    const plan = await MealPlan.findOne({ userId: req.params.userId })
      .sort({ weekStart: -1 })
      .populate("slots.recipe");

    if (!plan) return res.status(404).json({ success: false, message: "No meal plan found." });
    res.status(200).json({ success: true, plan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    await MealPlan.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateGroceryItem = async (req, res) => {
  try {
    const { itemIndex, checked } = req.body;
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found." });
    plan.groceryList[itemIndex].checked = checked;
    await plan.save();
    res.status(200).json({ success: true, groceryList: plan.groceryList });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
