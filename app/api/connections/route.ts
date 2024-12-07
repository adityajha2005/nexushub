import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Notification from "@/models/Notification"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { mentorId } = await request.json()

    if (!mentorId) {
      return NextResponse.json({ message: "Mentor ID is required" }, { status: 400 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const userId = decoded.id

    await connectDB()

    // Check if mentor exists
    const mentor = await User.findById(mentorId)
    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 })
    }

    // Check if already connected or pending
    if (mentor.connections?.includes(userId)) {
      return NextResponse.json({ message: "Already connected" }, { status: 400 })
    }

    if (mentor.pendingConnections?.includes(userId)) {
      return NextResponse.json({ message: "Connection request already sent" }, { status: 400 })
    }

    // Get user details for notification
    const user = await User.findById(userId).select('name')

    // Create notification for the mentor
    await Notification.create({
      recipient: mentorId,
      sender: userId,
      type: 'CONNECTION_REQUEST',
      message: `${user.name} sent you a connection request`,
      read: false,
      data: {
        userId: userId,
        type: 'connection_request'
      }
    })

    // Add to pending connections
    await User.findByIdAndUpdate(mentorId, {
      $addToSet: { pendingConnections: userId }
    })

    return NextResponse.json({ message: "Connection request sent successfully" })
  } catch (error) {
    console.error('Error in connection request:', error)
    return NextResponse.json({ 
      message: "Failed to process connection request" 
    }, { status: 500 })
  }
} 