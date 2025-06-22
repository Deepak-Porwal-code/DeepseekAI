import express from "express";
import { login, logout, signup } from "../controller/user.controller.js"; // ✅ Correctly imported

const router = express.Router();

// 🔐 Signup Route
router.post("/signup", signup);

// 🔐 Login Route
router.post("/login", login);

// 🔐 Logout Route
router.get("/logout", logout);

export default router;
