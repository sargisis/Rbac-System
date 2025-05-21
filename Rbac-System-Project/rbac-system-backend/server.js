import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Adminrouter from './Router/admin.js';
import AuthRouter from './Router/authRouter.js';
import GetUserRouter from './Router/GetUsers.js';
import DeleteRouter from './Router/DeleteUser.js';
import AvatarRouter from './Router/multer.js';
import path from 'path'
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


app.use('/api', Adminrouter);
app.use('/api' , AuthRouter);
app.use('/api/users', GetUserRouter);
app.use('/api/edit' , DeleteRouter);
app.use('/api' , AvatarRouter);
app.use("/uploads", express.static(path.resolve("uploads")));


app.listen(PORT, (err) => {
  err
    ? console.error('❌ Server error:', err)
    : console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
