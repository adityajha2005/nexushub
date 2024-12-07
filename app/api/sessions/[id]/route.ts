import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Session from "@/models/Session"
import Notification from "@/models/Notification"
import User from "@/models/User"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Cancellation request received for session:', params.id)
    
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      console.log('No token found')
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    const session = await Session.findById(params.id)
      .populate('mentor', 'name')
      .populate('mentee', 'name')
    
    if (!session) {
      console.log('Session not found:', params.id)
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    console.log('User ID:', decoded.id)

    // Check if user is authorized to cancel this session
    const userIsParticipant = 
      session.mentor._id.toString() === decoded.id || 
      session.mentee._id.toString() === decoded.id

    if (!userIsParticipant) {
      console.log('Unauthorized user attempted to cancel session')
      return NextResponse.json({ message: "Unauthorized to cancel this session" }, { status: 403 })
    }

    // Update session status first
    session.status = 'cancelled'
    await session.save()
    console.log('Session status updated to cancelled')

    // Create notifications for both users
    try {
      const cancellerId = decoded.id
      const isCancellerMentor = session.mentor._id.toString() === cancellerId
      
      // Create notification for the other party
      await Notification.create({
        recipient: isCancellerMentor ? session.mentee._id : session.mentor._id,
        sender: cancellerId,
        message: `Your session with ${isCancellerMentor ? session.mentor.name : session.mentee.name} has been cancelled`,
        type: 'session_cancelled',
        data: {
          sessionId: session._id,
          date: session.date,
          time: session.time
        }
      })

    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError)
      // Continue execution even if notification fails
    }

    return NextResponse.json({ 
      message: "Session cancelled successfully",
      sessionId: session._id
    })
  } catch (error) {
    console.error('Error cancelling session:', error)
    return NextResponse.json({ 
      message: "Failed to cancel session",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 