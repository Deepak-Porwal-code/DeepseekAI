import { User } from "../model/user.model.js";

// ✅ Admin-only route to clear all users
export const clearAllUsers = async (req, res) => {
  // Optional: Basic security using admin secret
  if (req.query.admin_secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized: Invalid admin secret" });
  }

  try {
    const result = await User.deleteMany({});
    res.status(200).json({ message: "All users deleted", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting users:", error.message);
    res.status(500).json({ error: "Failed to delete users" });
  }
};
