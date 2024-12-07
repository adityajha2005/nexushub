import { NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getAvatarUrl } from "@/lib/utils/avatar"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const user = await User.findById(params.id)
      .select('-password')
      .lean()

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Transform user data
    const transformedUser = {
      ...user,
      _id: user._id.toString(),
      avatar: (user.avatar && user.avatar !== '/placeholder.svg') 
        ? user.avatar 
        : getAvatarUrl(user._id.toString()),
      connections: user.connections?.length || 0
    }

    return NextResponse.json({ user: transformedUser })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: "Failed to fetch user profile" }, 
      { status: 500 }
    )
  }
} 