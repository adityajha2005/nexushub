import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

export async function connectDB() {
  try {
    const opts = {
      bufferCommands: false,
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, opts)
      console.log('🗄️ Connected to MongoDB')
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
} 