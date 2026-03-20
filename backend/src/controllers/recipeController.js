const axios  = require("axios");
const Recipe = require("../models/Recipe");

exports.getRecipes = async (req, res) => {
  try {
    const { search, goal, diet, page = 1, limit = 12 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (goal)   query.goal  = { $in: [goal, "all"] };
    if (diet)   query.diet  = { $in: diet.split(",") };

    const skip = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      Recipe.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Recipe.countDocuments(query),
    ]);
    res.status(200).json({ success: true, total, recipes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found." });
    res.status(200).json({ success: true, recipe });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, recipe });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found." });
    res.status(200).json({ success: true, recipe });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.searchSpoonacular = async (req, res) => {
  try {
    const { query = "healthy", diet, number = 12 } = req.query;
    const { data } = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      params: { apiKey: process.env.SPOONACULAR_API_KEY, query, number, addRecipeNutrition: true, ...(diet && { diet }) },
    });
    const recipes = data.results.map((r) => ({
      sourceId: String(r.id),
      name:     r.title,
      emoji:    "🍽️",
      tag:      r.dishTypes?.[0] || "Balanced",
      calories: Math.round(r.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 0),
      prepTime: `${r.readyInMinutes || 30} min`,
      diet:     r.diets || [],
      color:    "#E8F5E9",
    }));
    res.status(200).json({ success: true, recipes });
  } catch (err) { res.status(500).json({ success: false, message: "Spoonacular error: " + err.message }); }
};
