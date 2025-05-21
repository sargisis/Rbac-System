import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';

const AvatarRouter = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });


AvatarRouter.put('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default AvatarRouter;