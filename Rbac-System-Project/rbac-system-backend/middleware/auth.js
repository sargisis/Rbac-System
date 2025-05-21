import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};