import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['connection_request', 'connection_accepted', 'session_scheduled'],
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['mentee', 'mentor'],
    required: true
  },
  expertise: [String],
  experience: Number,
  rating: Number,
  avatar: String,
  notifications: [notificationSchema],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendingConnections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 