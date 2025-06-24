import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import userRoute from "./route/user.route.js";
import promptRoute from "./route/prompt.route.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const MONGO_DB = process.env.MONGO_DB;

// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",                    // local dev
  "https://deepseekai-frontend.onrender.com" // production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin like Postman or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// MongoDB Connection
mongoose
  .connect(MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Test route
app.get("/", (req, res) => {
  res.send("DeepseekAI Backend is Live 🚀");
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/deepseakai", promptRoute);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
