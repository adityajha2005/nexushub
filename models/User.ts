import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define roles in a constant object
export const USER_ROLES = {
  USER: 'user',
  MENTOR: 'mentor',
  MENTEE: 'mentee',
  ADMIN: 'admin'
} as const;

const notificationTypes = [
  'message',
  'connection',
  'session_request',
  'session_confirmed',
  'session_reminder',
  'session_cancelled',
  'session_completed'
] as const;

// Create the schema
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
    select: false,
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
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
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

// Add method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type NotificationType = typeof notificationTypes[number];

// Check if the model exists before creating a new one
let User: mongoose.Model<any>;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
}

export default User; 