import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const skills = searchParams.get('skills')
    const search = searchParams.get('search')

    await connectDB()

    let query: any = {}

    if (role) {
      query.role = role
    }

    if (skills) {
      query.skills = { $in: skills.split(',') }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .select('name username bio skills avatar role')
      .limit(50)

    return NextResponse.json({
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        bio: user.bio,
        skills: user.skills,
        avatar: user.avatar,
        role: user.role
      }))
    })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 