import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const body = await request.json()
    
    const { mentorId } = body

    if (!mentorId) {
      return NextResponse.json(
        { message: "Mentor ID is required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get both users in one go
    const [mentee, mentor] = await Promise.all([
      User.findById(decoded.id),
      User.findById(mentorId)
    ])

    // Check mentee exists
    if (!mentee) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Check mentor exists and is a mentor
    if (!mentor || mentor.role !== 'mentor') {
      return NextResponse.json(
        { message: "Invalid mentor" },
        { status: 400 }
      )
    }

    // Check if there's already a connection or pending request
    if (mentor.pendingConnections.includes(decoded.id) || 
        mentor.connections.includes(decoded.id) ||
        mentee.pendingConnections.includes(mentorId) || 
        mentee.connections.includes(mentorId)) {
      return NextResponse.json(
        { message: "Connection request already sent or already connected" },
        { status: 400 }
      )
    }

    // Create notifications for both users
    const mentorNotification = {
      type: 'connection_request',
      from: decoded.id,
      message: `${mentee.name} wants to connect with you`,
      read: false,
      createdAt: new Date()
    }

    const menteeNotification = {
      type: 'connection_request',
      from: decoded.id,
      message: `You sent a connection request to ${mentor.name}`,
      read: false,
      createdAt: new Date()
    }

    // Update both users atomically with their respective notifications
    await Promise.all([
      // Update mentor
      User.findByIdAndUpdate(mentorId, {
        $push: {
          pendingConnections: decoded.id,
          notifications: mentorNotification
        }
      }),
      // Update mentee with their own notification
      User.findByIdAndUpdate(decoded.id, {
        $push: {
          pendingConnections: mentorId,
          notifications: menteeNotification
        }
      })
    ])

    return NextResponse.json({
      message: "Connection request sent successfully",
      notifications: {
        mentor: mentorNotification,
        mentee: menteeNotification
      }
    })
  } catch (error) {
    console.error('Connection request error:', error)
    return NextResponse.json(
      { message: "Failed to send connection request" },
      { status: 500 }
    )
  }
} 