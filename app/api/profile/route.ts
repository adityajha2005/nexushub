import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { USER_ROLES } from "@/models/User"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    console.log('Token in profile API:', token?.value)

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    console.log('Decoded token:', decoded)

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

    if (data.role) {
      data.role = data.role.toLowerCase()
      if (!Object.values(USER_ROLES).includes(data.role)) {
        return NextResponse.json({ 
          message: `Invalid role. Must be one of: ${Object.values(USER_ROLES).join(', ')}` 
        }, { status: 400 })
      }
    }

    await connectDB()

    const updateData = {
      username: data.username || '',
      bio: data.bio || '',
      title: data.title || '',
      role: data.role || USER_ROLES.USER,
      skills: Array.isArray(data.skills) ? data.skills : []
    }

    console.log('Updating user with data:', updateData)

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

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