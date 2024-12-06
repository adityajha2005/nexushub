import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()
    
    const mentors = await User.find({ role: 'mentor' })
      .select('_id name expertise experience rating avatar')
      .lean()

    return NextResponse.json({ mentors })
  } catch (error) {
    console.error('Error fetching mentors:', error)
    return NextResponse.json(
      { message: "Failed to fetch mentors" },
      { status: 500 }
    )
  }
} 