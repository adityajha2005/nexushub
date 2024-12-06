import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()
    console.log('DB connection successful')
    
    const mentors = await User.find({ role: 'mentor' })
      .select('_id name expertise experience rating avatar')
      .lean()

    console.log('Raw mentors data:', JSON.stringify(mentors, null, 2))

    if (!Array.isArray(mentors)) {
      console.error('Mentors is not an array:', mentors)
      return NextResponse.json({
        message: "Invalid data format",
        mentors: []
      }, { status: 500 })
    }

    // Transform the data before sending
    const transformedMentors = mentors.map(mentor => {
      if (!mentor || typeof mentor !== 'object') {
        console.error('Invalid mentor object:', mentor)
        return null
      }

      return {
        _id: mentor._id ? mentor._id.toString() : '',
        name: mentor.name || '',
        expertise: Array.isArray(mentor.expertise) ? mentor.expertise : [],
        experience: typeof mentor.experience === 'number' ? mentor.experience : 0,
        rating: typeof mentor.rating === 'number' ? mentor.rating : 0,
        avatar: mentor.avatar || '/placeholder.svg'
      }
    }).filter(Boolean) // Remove any null values

    console.log('Transformed mentors data:', JSON.stringify(transformedMentors, null, 2))

    return new NextResponse(JSON.stringify({ mentors: transformedMentors }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in /api/mentors:', error)
    return new NextResponse(JSON.stringify({
      message: "Failed to fetch mentors",
      mentors: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 