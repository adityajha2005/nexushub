import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Session from "@/models/Session"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    await connectDB()

    const sessions = await Session.find({
      $or: [
        { mentee: decoded.id },
        { mentor: decoded.id }
      ]
    })
    .populate('mentor', 'name avatar')
    .populate('mentee', 'name avatar')
    .sort({ date: 1 }) // Sort by date ascending
    .lean()

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session._id.toString(),
        mentor: {
          id: session.mentor._id.toString(),
          name: session.mentor.name,
          avatar: session.mentor.avatar
        },
        mentee: {
          id: session.mentee._id.toString(),
          name: session.mentee.name,
          avatar: session.mentee.avatar
        },
        date: session.date,
        time: session.time,
        status: session.status
      }))
    })
  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json(
      { message: "Failed to fetch sessions" },
      { status: 500 }
    )
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
    const body = await request.json()
    
    const { mentorId, date, time } = body

    if (!mentorId || !date || !time) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    await connectDB()

    const mentor = await User.findById(mentorId)
    if (!mentor || mentor.role !== 'mentor') {
      return NextResponse.json(
        { message: "Invalid mentor" },
        { status: 400 }
      )
    }

    const session = await Session.create({
      mentor: mentorId,
      mentee: decoded.id,
      date: new Date(date),
      time,
      status: 'scheduled'
    })

    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name avatar')
      .populate('mentee', 'name avatar')
      .lean()

    // Create notification for mentor
    await User.findByIdAndUpdate(mentorId, {
      $push: {
        notifications: {
          type: 'session_scheduled',
          from: decoded.id,
          message: `New session scheduled for ${new Date(date).toLocaleDateString()} at ${time}`,
        }
      }
    })

    return NextResponse.json({
      message: "Session booked successfully",
      session: {
        id: populatedSession._id.toString(),
        mentor: {
          id: populatedSession.mentor._id.toString(),
          name: populatedSession.mentor.name,
          avatar: populatedSession.mentor.avatar
        },
        mentee: {
          id: populatedSession.mentee._id.toString(),
          name: populatedSession.mentee.name,
          avatar: populatedSession.mentee.avatar
        },
        date: populatedSession.date,
        time: populatedSession.time,
        status: populatedSession.status
      }
    })
  } catch (error) {
    console.error('Session booking error:', error)
    return NextResponse.json(
      { message: "Failed to book session" },
      { status: 500 }
    )
  }
} 