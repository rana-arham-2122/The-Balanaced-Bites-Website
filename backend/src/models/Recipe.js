const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String },
    emoji:       { type: String, default: "🍽️" },
    tag:         { type: String },
    calories:    { type: Number },
    prepTime:    { type: String },
    servings:    { type: Number, default: 2 },
    goal:        { type: String, default: "all" },
    diet:        [{ type: String }],
    allergies:   [{ type: String }],
    ingredients: [{ name: String, amount: String }],
    steps:       [{ type: String }],
    nutrition: {
      protein: Number,
      carbs:   Number,
      fat:     Number,
      fibre:   Number,
    },
    sourceId: { type: String },
    color:    { type: String, default: "#E8F5E9" },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

recipeSchema.index({ name: "text", tag: "text" });
recipeSchema.index({ goal: 1, diet: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);
