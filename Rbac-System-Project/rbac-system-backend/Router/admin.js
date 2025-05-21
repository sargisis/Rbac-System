import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import crypto from 'crypto'
import sendActivationEmail from '../utils/sendActivation.js';
import { authMiddleware } from '../middleware/auth.js';

const AdminRouter = express.Router();

AdminRouter.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: { active: true }
    });

    res.status(201).json({ message: 'Admin created', userId: newAdmin._id, role: newAdmin.role});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

AdminRouter.post('/users', async (req, res) => {
  try {
    const { name, email, phone, role = 'user', avatar } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    const user = await User.create({
      name,
      email,
      phone,
      avatar,
      role,
      status: { active: false },
      resetToken,
      resetTokenExpires
    });

    await sendActivationEmail(email, resetToken);

    res.status(201).json({ message: 'User created. Activation email sent.' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Error creating user', err });
  }
});

AdminRouter.get('/users', authMiddleware , async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    }catch(err) {
        res.status(500).json({message: 'Failed to fetch users'})
    }
})

export default AdminRouter;
