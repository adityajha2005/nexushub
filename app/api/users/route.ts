import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getAvatarUrl } from "@/lib/utils/avatar"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")
    let userId = null

    if (token) {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
      userId = decoded.id
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const skills = searchParams.get('skills')?.split(',')

    await connectDB()

    let query: any = {}

    // Add role filter
    if (role && role !== 'all') {
      query.role = role
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Add skills filter
    if (skills && skills.length > 0) {
      query.skills = { $in: skills }
    }

    const users = await User.find(query)
      .select('_id name role skills bio avatar title connections pendingConnections')
      .lean()

    // Transform the data before sending
    const transformedUsers = users.map(user => {
      if (!user || typeof user !== 'object') {
        console.error('Invalid user object:', user)
        return null
      }

      let connectionStatus = 'none'
      if (userId) {
        if (user.connections?.includes(userId)) {
          connectionStatus = 'connected'
        } else if (user.pendingConnections?.includes(userId)) {
          connectionStatus = 'pending'
        }
      }

      return {
        _id: user._id.toString(),
        name: user.name || '',
        role: user.role || '',
        skills: Array.isArray(user.skills) ? user.skills : [],
        bio: user.bio || '',
        avatar: (user.avatar && user.avatar !== '/placeholder.svg') 
          ? user.avatar 
          : getAvatarUrl(user._id.toString()),
        title: user.title || '',
        connectionStatus
      }
    }).filter(Boolean)

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error('Error in /api/users:', error)
    return NextResponse.json(
      { 
        message: "Failed to fetch users",
        users: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 