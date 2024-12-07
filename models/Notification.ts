import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['session_scheduled', 'session_cancelled', 'CONNECTION_REQUEST'],
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

notificationSchema.pre('save', function(next) {
  console.log('Saving notification:', this)
  next()
})

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
export default Notification 