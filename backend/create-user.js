const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function saveUser() {
  try {
    console.log("\n🔐 Creating Test User...\n");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rana_balancedbites:rana%4012345@cluster0.nqvcpfw.mongodb.net/rana_balancedbites?appName=Cluster0");
    console.log("✅ Connected to MongoDB\n");

    // User data
    const userData = {
      email: "test@example.com",
      password: "Test@123",
      name: "Test User"
    };

    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    // Create user object
    const newUser = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: 'user'
    });

    // Save to database
    const savedUser = await newUser.save();
    
    console.log("✅ User Created Successfully!");
    console.log("\n📋 User Details:");
    console.log(`   ID: ${savedUser._id}`);
    console.log(`   Email: ${savedUser.email}`);
    console.log(`   Name: ${savedUser.name}`);
    console.log(`   Role: ${savedUser.role}`);
    console.log(`   Created: ${savedUser.createdAt}\n`);

    console.log("🔓 Login Credentials:");
    console.log(`   Email: test@example.com`);
    console.log(`   Password: Test@123\n`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB\n");

  } catch (error) {
    if (error.code === 11000) {
      console.error("❌ User already exists with this email!");
      console.log("\nTry logging in with:");
      console.log("   Email: test@example.com");
      console.log("   Password: Test@123\n");
    } else {
      console.error("❌ Error:", error.message);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

saveUser();
