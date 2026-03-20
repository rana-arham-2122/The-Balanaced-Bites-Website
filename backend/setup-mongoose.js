const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// ===== SCHEMAS =====

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [String],
  instructions: [String],
  servings: Number,
  calories: Number,
  cookTime: Number,
  prepTime: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Meal Plan Schema
const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: Date,
  meals: [
    {
      day: String,
      breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
    }
  ],
  groceryList: [
    {
      item: String,
      quantity: String,
      purchased: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ===== MODELS =====
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// ===== SETUP FUNCTION =====
async function setupDatabase() {
  try {
    console.log("\n╔════════════════════════════════════════════════╗");
    console.log("  MONGOOSE DATABASE SETUP & INITIALIZATION");
    console.log("╚════════════════════════════════════════════════╝\n");

    // Connect to MongoDB
    console.log("🔗 Connecting to MongoDB Atlas...");
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb+srv://rana_balancedbites:rana%4012345@cluster0.nqvcpfw.mongodb.net/rana_balancedbites?appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("✅ Connected to MongoDB Atlas\n");

    // ===== CREATE USERS =====
    console.log("👥 Creating Users...");
    const users = [];
    
    const userDataArray = [
      { email: "admin@example.com", password: "Admin@123", name: "Admin User", role: "admin" },
      { email: "john@example.com", password: "John@123", name: "John Doe", role: "user" },
      { email: "jane@example.com", password: "Jane@123", name: "Jane Smith", role: "user" },
      { email: "test@example.com", password: "Test@123", name: "Test User", role: "user" }
    ];

    for (const userData of userDataArray) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        const user = new User({
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role
        });
        const savedUser = await user.save();
        users.push(savedUser);
        console.log(`   ✅ ${userData.email} (${userData.role})`);
      } else {
        users.push(existingUser);
        console.log(`   ⚠️  ${userData.email} already exists`);
      }
    }
    console.log("");

    // ===== CREATE RECIPES =====
    console.log("🍽️  Creating Sample Recipes...");
    const recipes = [];
    
    const recipeDataArray = [
      {
        title: "Grilled Chicken Salad",
        description: "Healthy grilled chicken with fresh vegetables",
        ingredients: ["Chicken breast", "Mixed greens", "Tomatoes", "Cucumbers", "Olive oil"],
        instructions: ["Grill chicken", "Chop vegetables", "Mix together", "Drizzle with olive oil"],
        servings: 2,
        calories: 350,
        cookTime: 20,
        prepTime: 15
      },
      {
        title: "Vegetable Stir Fry",
        description: "Quick and nutritious vegetable dish",
        ingredients: ["Broccoli", "Bell peppers", "Soy sauce", "Garlic", "Ginger"],
        instructions: ["Heat oil", "Add garlic and ginger", "Add vegetables", "Season with soy sauce"],
        servings: 3,
        calories: 280,
        cookTime: 15,
        prepTime: 10
      },
      {
        title: "Salmon with Asparagus",
        description: "Protein-rich dinner with omega-3 fatty acids",
        ingredients: ["Salmon fillet", "Asparagus", "Lemon", "Olive oil", "Salt"],
        instructions: ["Preheat oven", "Season salmon", "Arrange asparagus", "Bake for 20 minutes"],
        servings: 2,
        calories: 450,
        cookTime: 25,
        prepTime: 10
      },
      {
        title: "Quinoa Buddha Bowl",
        description: "Complete meal with grains, proteins, and vegetables",
        ingredients: ["Quinoa", "Chickpeas", "Sweet potato", "Kale", "Tahini"],
        instructions: ["Cook quinoa", "Roast vegetables", "Assemble bowl", "Drizzle with tahini"],
        servings: 2,
        calories: 520,
        cookTime: 30,
        prepTime: 15
      }
    ];

    for (const recipeData of recipeDataArray) {
      const existingRecipe = await Recipe.findOne({ title: recipeData.title });
      if (!existingRecipe) {
        const recipe = new Recipe(recipeData);
        const savedRecipe = await recipe.save();
        recipes.push(savedRecipe);
        console.log(`   ✅ ${recipeData.title}`);
      } else {
        recipes.push(existingRecipe);
        console.log(`   ⚠️  ${recipeData.title} already exists`);
      }
    }
    console.log("");

    // ===== CREATE MEAL PLANS =====
    console.log("📅 Creating Sample Meal Plans...");
    
    if (users.length > 0 && recipes.length > 0) {
      const existingPlan = await MealPlan.findOne({ userId: users[1]._id });
      if (!existingPlan) {
        const mealPlan = new MealPlan({
          userId: users[1]._id,
          weekStart: new Date(),
          meals: [
            {
              day: "Monday",
              breakfast: recipes[0]._id,
              lunch: recipes[1]._id,
              dinner: recipes[2]._id
            },
            {
              day: "Tuesday",
              breakfast: recipes[1]._id,
              lunch: recipes[2]._id,
              dinner: recipes[3]._id
            }
          ],
          groceryList: [
            { item: "Chicken breast", quantity: "500g", purchased: false },
            { item: "Fresh vegetables", quantity: "2kg", purchased: true },
            { item: "Salmon fillet", quantity: "400g", purchased: false }
          ]
        });
        await mealPlan.save();
        console.log("   ✅ Meal plan created for John Doe");
      } else {
        console.log("   ⚠️  Meal plan already exists");
      }
    }
    console.log("");

    // ===== DISPLAY COLLECTIONS =====
    console.log("📊 Database Collections:");
    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();
    const mealPlanCount = await MealPlan.countDocuments();
    
    console.log(`   Users: ${userCount}`);
    console.log(`   Recipes: ${recipeCount}`);
    console.log(`   Meal Plans: ${mealPlanCount}`);
    console.log("");

    // ===== DISPLAY TEST CREDENTIALS =====
    console.log("╔════════════════════════════════════════════════╗");
    console.log("  TEST CREDENTIALS");
    console.log("╚════════════════════════════════════════════════╝\n");
    
    const testUsers = [
      { email: "admin@example.com", password: "Admin@123", role: "Admin" },
      { email: "john@example.com", password: "John@123", role: "User" },
      { email: "jane@example.com", password: "Jane@123", role: "User" },
      { email: "test@example.com", password: "Test@123", role: "User" }
    ];

    testUsers.forEach(user => {
      console.log(`${user.role}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}\n`);
    });

    console.log("╔════════════════════════════════════════════════╗");
    console.log("  ✅ SETUP COMPLETE!");
    console.log("╚════════════════════════════════════════════════╝\n");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB\n");

  } catch (error) {
    console.error("❌ Setup Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run setup
setupDatabase();
