import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: {type: String , required: false},
  phone: {type: String , required: false},
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  permissions: {
    viewName: { type: Boolean, default: true },
    viewPhone: { type: Boolean, default: false }
  },
  status: {
    active: { type: Boolean, default: false }
  },
  avatar: {
    type: String,
    default: ''   
  },
  resetToken: String,
  resetTokenExpires: Date
});

export default mongoose.model("User", UserSchema);
