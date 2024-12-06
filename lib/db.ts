import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    console.log('Using cached database connection')
    return cached.conn
  }

  try {
    console.log('Connecting to MongoDB...')
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    cached.conn = conn
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Add this type declaration for global mongoose cache
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
} 