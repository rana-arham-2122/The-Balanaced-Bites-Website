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
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🌿 Balanced Bites API → http://localhost:${PORT}`);
  console.log(`✅ Health check  → http://localhost:${PORT}/api/health\n`);
});

// Allow port reuse immediately
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
