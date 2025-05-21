import User from "../models/User.js";
import express from 'express';
import { authMiddleware } from "../middleware/auth.js";

const GetUserRouter = express.Router();


GetUserRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error when getting users" });
  }
});


GetUserRouter.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});


GetUserRouter.put('/:_id', authMiddleware, async (req, res) => {
  const { _id } = req.params;

  if (req.user._id !== _id && req.user.role !== "admin") {
    return res.status(403).json({ message: "You can only update your own profile." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user information." });
  }
});

export default GetUserRouter;
