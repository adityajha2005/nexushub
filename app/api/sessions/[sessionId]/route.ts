import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Session from "@/models/Session"

export async function DELETE(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
    }

    await connectDB()

    // Find the session first
    const session = await Session.findById(sessionId)

    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    // Check if user is authorized to cancel this session
    const userIsParticipant = 
      session.mentor.toString() === decoded.id || 
      session.mentee.toString() === decoded.id

    if (!userIsParticipant) {
      return NextResponse.json({ message: "Unauthorized to cancel this session" }, { status: 403 })
    }

    // Get user details for notifications
    const [mentorUser, menteeUser] = await Promise.all([
      User.findById(session.mentor),
      User.findById(session.mentee)
    ])

    if (!mentorUser || !menteeUser) {
      return NextResponse.json({ message: "User data not found" }, { status: 404 })
    }

    // Create notifications for both users
    const notification = {
      type: 'session_cancelled',
      from: decoded.id,
      message: `Session on ${new Date(session.date).toLocaleDateString()} at ${session.time} has been cancelled`,
      read: false,
      createdAt: new Date()
    }

    // Update session status and notify users atomically
    await Promise.all([
      Session.findByIdAndUpdate(sessionId, { status: 'cancelled' }),
      User.findByIdAndUpdate(session.mentor, {
        $push: { notifications: notification }
      }),
      User.findByIdAndUpdate(session.mentee, {
        $push: { notifications: notification }
      })
    ])

    return NextResponse.json({ 
      message: "Session cancelled successfully",
      sessionId 
    })

  } catch (error) {
    console.error('Session cancellation error:', error)
    return NextResponse.json(
      { message: "Failed to cancel session" },
      { status: 500 }
    )
  }
} 