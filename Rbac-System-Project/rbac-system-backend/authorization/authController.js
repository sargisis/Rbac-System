import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv'
import crypto from 'crypto'
import sendActivationEmail from '../utils/sendActivation.js';

dotenv.config();

export const createUser = async (req, res) => {
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
      role,
      avatar,
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
};


export const activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.status.active = true;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    const jwtToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userData } = user._doc;
    res.json({ ...userData, token: jwtToken });

  } catch (err) {
    console.error('Activation error:', err);
    res.status(500).json({ message: 'Activation failed', err });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const {password , token} = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password successfully reset' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Reset password error', err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.status.active) {
      return res.status(403).json({ message: 'Account is not activated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    const { password: _, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error', err });
  }
};
