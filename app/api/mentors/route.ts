import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Dummy experience data mapping
const mentorExperience = {
  "Dr. Emily Chen": 12,
  "John Smith": 8,
  "Sarah Johnson": 15,
  "Michael Brown": 10,
  "David Wilson": 7,
  "Lisa Anderson": 9,
  "James Taylor": 11,
  "Emma Davis": 6,
  "Robert Miller": 14,
  "Jennifer White": 13
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")
    let userId = null

    if (token) {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
      userId = decoded.id
    }

    await connectDB()
    
    const mentors = await User.find({ role: 'mentor' })
      .select('_id name expertise rating avatar pendingConnections connections')
      .lean()

    const transformedMentors = mentors.map(mentor => {
      let connectionStatus = 'none'
      if (userId) {
        if (mentor.connections?.includes(userId)) {
          connectionStatus = 'connected'
        } else if (mentor.pendingConnections?.includes(userId)) {
          connectionStatus = 'pending'
        }
      }

      // Add dummy experience based on mentor name or default to a random number between 5-15
      const experience = mentorExperience[mentor.name] || 
        Math.floor(Math.random() * (15 - 5 + 1)) + 5

      return {
        _id: mentor._id.toString(),
        name: mentor.name,
        expertise: mentor.expertise || [],
        experience, // Add the experience field
        rating: mentor.rating || 4.5,
        avatar: mentor.avatar || '/placeholder.svg',
        connectionStatus
      }
    })

    return NextResponse.json({ mentors: transformedMentors })
  } catch (error) {
    console.error('Error in /api/mentors:', error)
    return NextResponse.json({
      message: "Failed to fetch mentors",
      mentors: []
    }, { status: 500 })
  }
} 