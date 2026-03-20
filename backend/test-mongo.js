require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Testing MongoDB Connection...\n");
console.log(`📋 Configuration:`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}\n`);

const testConnection = async () => {
  try {
    console.log("⏳ Attempting connection...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log("\n✅ SUCCESS! MongoDB Connected");
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? "Connected" : "Disconnected"}\n`);

    // Test with a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📦 Collections: ${collections.length}`);
    collections.forEach(c => console.log(`   - ${c.name}`));

    await mongoose.disconnect();
    console.log("\n✅ Test Complete - Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED");
    console.error(`Error: ${error.message}\n`);
    console.error("Troubleshooting:\n");
    console.error("1. **Check MONGO_URI in .env**");
    console.error("   Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname\n");
    console.error("2. **Verify MongoDB Atlas Cluster**");
    console.error("   - Is cluster Active (not paused)?");
    console.error("   - Check IP Whitelist includes your IP or 0.0.0.0/0\n");
    console.error("3. **Check Username & Password**");
    console.error("   - Verify credentials are correct");
    console.error("   - Check for special characters in password\n");
    console.error("4. **Check Network**");
    console.error("   - Ping 8.8.8.8 to verify internet connection\n");
    process.exit(1);
  }
};

testConnection();
