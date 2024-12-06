import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const notificationTypes = [
  'message',
  'connection',
  'session_request',
  'session_confirmed',
  'session_reminder',
  'session_cancelled',
  'session_completed'
] as const;

const userRoles = ['user', 'mentor', 'mentee', 'admin'] as const;

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  bio: String,
  title: String,
  role: {
    type: String,
    enum: userRoles,
    default: 'user'
  },
  skills: [String],
  avatar: String,
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  notifications: [{
    type: {
      type: String,
      enum: notificationTypes,
      required: true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    message: String,
    data: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

export type UserRole = typeof userRoles[number];
export type NotificationType = typeof notificationTypes[number];

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 