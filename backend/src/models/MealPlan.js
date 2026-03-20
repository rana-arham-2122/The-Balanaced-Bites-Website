const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStart: { type: Date, required: true },
    slots: [
      {
        day:    { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
        meal:   { type: String, enum: ["Breakfast","Lunch","Dinner","Snack"] },
        recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      },
    ],
    groceryList: [
      {
        name:     String,
        amount:   String,
        category: String,
        checked:  { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
