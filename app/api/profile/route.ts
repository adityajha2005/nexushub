import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    await connectDB()
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const data = await request.json()

    await connectDB()

    // First, find the user
    const user = await User.findById(decoded.id)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user fields
    user.username = data.username
    user.bio = data.bio
    user.skills = data.skills.split(',').map((skill: string) => skill.trim())

    // Save the updated user
    await user.save()

    // Fetch the fresh user data
    const updatedUser = await User.findById(decoded.id).select("-password")

    console.log('Updated user:', updatedUser) // Debug log

    const response = NextResponse.json({ user: updatedUser })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const data = await request.json()

    await connectDB()
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { 
        username: data.username,
        bio: data.bio,
        skills: data.skills.split(',').map((skill: string) => skill.trim())
      },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
} 