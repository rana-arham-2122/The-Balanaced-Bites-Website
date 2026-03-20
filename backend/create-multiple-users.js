const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createMultipleUsers(users) {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rana_balancedbites:rana%4012345@cluster0.nqvcpfw.mongodb.net/rana_balancedbites?appName=Cluster0");
    console.log("\n🔐 Creating Multiple Users...\n");

    const createdUsers = [];

    for (const userData of users) {
      const hashedPassword = await bcryptjs.hash(userData.password, 10);
      const newUser = new User({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'user'
      });
      
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created: ${userData.email}`);
    }

    console.log(`\n✅ ${createdUsers.length} users created successfully!\n`);
    
    createdUsers.forEach(user => {
      console.log(`📧 ${user.email} (${user.name})`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Done!\n");

  } catch (error) {
    if (error.code === 11000) {
      console.error("❌ One or more users already exist!");
    } else {
      console.error("❌ Error:", error.message);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Define users to create
const usersToCreate = [
  {
    email: "john@example.com",
    password: "John@123",
    name: "John Doe"
  },
  {
    email: "jane@example.com",
    password: "Jane@123",
    name: "Jane Smith"
  },
  {
    email: "admin@example.com",
    password: "Admin@123",
    name: "Admin User",
    role: "admin"
  }
];

createMultipleUsers(usersToCreate);
