import './load-env'
import { connectDB } from "@/lib/db"
import User from "@/models/User"

async function testConnection() {
  try {
    await connectDB()
    console.log('Database connected successfully')

    // Try to fetch users
    const users = await User.find({ role: 'mentor' })
    console.log('Found mentors:', users.length)
    if (users.length > 0) {
      console.log('Sample mentor:', {
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('Database test failed:', error)
    process.exit(1)
  }
}

testConnection() 