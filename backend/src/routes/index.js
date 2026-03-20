const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");

// ── Auth ──────────────────────────────────────────────
const authRouter = express.Router();
const { register, login, getProfile, updateProfile, refreshToken, logout } = require("../controllers/authController");
authRouter.post("/register",  register);
authRouter.post("/login",     login);
authRouter.post("/refresh",   refreshToken);
authRouter.get ("/profile",   protect, getProfile);
authRouter.put ("/profile",   protect, updateProfile);
authRouter.post("/logout",    protect, logout);

// ── Recipes ───────────────────────────────────────────
const recipeRouter = express.Router();
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, searchSpoonacular } = require("../controllers/recipeController");
recipeRouter.get   ("/spoonacular/search", protect, searchSpoonacular);
recipeRouter.get   ("/",    getRecipes);
recipeRouter.get   ("/:id", getRecipeById);
recipeRouter.post  ("/",    protect, adminOnly, createRecipe);
recipeRouter.put   ("/:id", protect, adminOnly, updateRecipe);
recipeRouter.delete("/:id", protect, adminOnly, deleteRecipe);

// ── Meal Plan ─────────────────────────────────────────
const planRouter = express.Router();
const { saveMealPlan, getMealPlan, deleteMealPlan, updateGroceryItem } = require("../controllers/mealPlanController");
planRouter.post  ("/",            protect, saveMealPlan);
planRouter.get   ("/:userId",     protect, getMealPlan);
planRouter.delete("/:id",         protect, deleteMealPlan);
planRouter.patch ("/:id/grocery", protect, updateGroceryItem);

// ── Admin ─────────────────────────────────────────────
const adminRouter = express.Router();
const { getDashboard, getAllUsers, deleteUser, updateUserRole } = require("../controllers/adminController");
adminRouter.get   ("/dashboard",      protect, adminOnly, getDashboard);
adminRouter.get   ("/users",          protect, adminOnly, getAllUsers);
adminRouter.delete("/users/:id",      protect, adminOnly, deleteUser);
adminRouter.patch ("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = { authRouter, recipeRouter, planRouter, adminRouter };
