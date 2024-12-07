import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.HEROKU_MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        // Add any additional MongoDB options if needed
      })
      console.log('Connected to MongoDB')
    }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
} 