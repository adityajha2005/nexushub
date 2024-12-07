import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getAvatarUrl } from "@/lib/utils/avatar"

export const dynamic = 'force-dynamic'

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

// Avatar styles available in DiceBear
const avatarStyles = [
  'adventurer', 
  'avataaars', 
  'big-ears', 
  'bottts', 
  'croodles',
  'micah', 
  'miniavs', 
  'open-peeps',
  'pixel-art'
]

// Function to generate random avatar URL
function getRandomAvatar(seed: string) {
  const styles = ['personas', 'bottts', 'avataaars'] // Using most reliable styles
  const style = styles[Math.floor(Math.random() * styles.length)]
  // Using more reliable service and parameters
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=128`
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

      // Generate avatar URL if not already set or if it's a placeholder
      const avatarUrl = (mentor.avatar && mentor.avatar !== '/placeholder.svg') 
        ? mentor.avatar 
        : getAvatarUrl(mentor._id.toString())

      console.log('Generated avatar URL for', mentor.name, ':', avatarUrl)

      return {
        _id: mentor._id.toString(),
        name: mentor.name,
        expertise: mentor.expertise || [],
        experience: mentorExperience[mentor.name] || 
          Math.floor(Math.random() * (15 - 5 + 1)) + 5,
        rating: mentor.rating || 4.5,
        avatar: avatarUrl,
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