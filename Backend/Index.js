import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from './route/user.route.js'; 
import promptRoute from './route/prompt.route.js';
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT || 5000; 
const MONGO_DB = process.env.MONGO_DB;

// middleware 
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// MongoDB connection
mongoose
  .connect(MONGO_DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/v1/user", userRoute); 
app.use("/api/v1/deepseakai", promptRoute); 

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
