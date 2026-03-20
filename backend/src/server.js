require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { authRouter, recipeRouter, planRouter, adminRouter } = require("./routes");

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/api/", limiter);
app.use("/api/v1/auth/login",    authLimiter);
app.use("/api/v1/auth/register", authLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/auth",     authRouter);
app.use("/api/v1/recipes",  recipeRouter);
app.use("/api/v1/mealplan", planRouter);
app.use("/api/v1/admin",    adminRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "🌿 Balanced Bites API is running!" });
});

app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` }));
app.use((err, req, res, next) => {
  console.error("❌", err.stack);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 Balanced Bites API → http://localhost:${PORT}`);
  console.log(`✅ Health check  → http://localhost:${PORT}/api/health\n`);
});
