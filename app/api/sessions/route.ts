import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Session from "@/models/Session"
import mongoose from 'mongoose'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Please login to book a session" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const { mentorId, date, time } = await request.json()

    if (!mentorId || !date || !time) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Convert mentorId to ObjectId
    let mentorObjectId;
    try {
      mentorObjectId = new mongoose.Types.ObjectId(mentorId)
    } catch (error) {
      return NextResponse.json({ message: "Invalid mentor ID format" }, { status: 400 })
    }

    // Get both users
    const [mentee, mentor] = await Promise.all([
      User.findById(decoded.id),
      User.findById(mentorObjectId).select('name notifications')
    ]).catch(error => {
      console.error('User fetch error:', error)
      throw new Error('Failed to fetch users')
    })

    if (!mentee || !mentor) {
      return NextResponse.json({ 
        message: !mentee ? "Mentee not found" : "Mentor not found" 
      }, { status: 404 })
    }

    // Check if session already exists
    const existingSession = await Session.findOne({
      mentor: mentorObjectId,
      date: new Date(date),
      time: time,
      status: 'scheduled'
    }).catch(error => {
      console.error('Session check error:', error)
      throw new Error('Failed to check existing sessions')
    })

    if (existingSession) {
      return NextResponse.json({ message: "This time slot is already booked" }, { status: 400 })
    }

    // Create the session
    const session = await Session.create({
      mentor: mentorObjectId,
      mentee: decoded.id,
      date: new Date(date),
      time,
      status: 'scheduled'
    }).catch(error => {
      console.error('Session creation error:', error)
      throw new Error('Failed to create session')
    })

    // Add notification for mentor
    mentor.notifications.push({
      type: 'session_scheduled',
      from: decoded.id,
      message: `${mentee.name} has scheduled a session with you for ${new Date(date).toLocaleDateString()} at ${time}`,
      read: false,
      createdAt: new Date()
    })

    await mentor.save().catch(error => {
      console.error('Notification save error:', error)
      throw new Error('Failed to save notification')
    })

    return NextResponse.json({ 
      message: "Session booked successfully",
      session: {
        id: session._id,
        mentor: {
          id: mentor._id,
          name: mentor.name
        },
        date,
        time
      }
    })
  } catch (error) {
    console.error("Session booking error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to book session. Please try again later." },
      { status: 500 }
    )
  }
}

// Add GET endpoint to fetch sessions
export async function GET(request: Request) {
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
        { mentor: decoded.id },
        { mentee: decoded.id }
      ]
    })
    .populate('mentor', 'name avatar')
    .populate('mentee', 'name avatar')
    .sort({ date: 1 })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
} 