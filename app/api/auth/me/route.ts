import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
      await connectDB()
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return NextResponse.json({ user: null }, { status: 401 })
      }

      const userData = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        skills: user.skills || [],
      }

      return NextResponse.json({ user: userData }, { status: 200 })
    } catch (jwtError) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
} 