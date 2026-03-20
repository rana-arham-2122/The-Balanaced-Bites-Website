const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: {
      gender:          { type: String },
      age:             { type: Number },
      weight:          { type: Number },
      weightUnit:      { type: String, default: "kg" },
      height:          { type: Number },
      heightUnit:      { type: String, default: "cm" },
      goal:            { type: String },
      workoutFreq:     { type: String },
      workoutDuration: { type: String },
      diet:            [{ type: String }],
      allergies:       [{ type: String }],
    },
    refreshToken: { type: String, select: false },
    isOnboarded:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
