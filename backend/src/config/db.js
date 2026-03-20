const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB offline: ${error.message}`);
    console.warn(`⚠️  API will run with static/mock data only`);
    // Don't exit - allow API to run without database
  }
};

module.exports = connectDB;
