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
    const { targetUserId } = await request.json()

    await connectDB()

    // Get both users
    const [currentUser, targetUser] = await Promise.all([
      User.findById(decoded.id),
      User.findById(targetUserId)
    ])

    if (!currentUser || !targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if connection already exists
    const existingConnection = currentUser.connections.find(
      conn => conn.user.toString() === targetUserId
    )

    if (existingConnection) {
      return NextResponse.json(
        { message: "Connection already exists" },
        { status: 400 }
      )
    }

    // Create connection request
    currentUser.connections.push({
      user: targetUserId,
      status: 'pending',
      initiator: true
    })

    targetUser.connections.push({
      user: decoded.id,
      status: 'pending',
      initiator: false
    })

    // Add notification for target user
    targetUser.notifications.push({
      type: 'connection_request',
      from: decoded.id,
      message: `${currentUser.name} wants to connect with you`
    })

    await Promise.all([currentUser.save(), targetUser.save()])

    return NextResponse.json({ message: "Connection request sent" })
  } catch (error) {
    console.error("Connection request error:", error)
    return NextResponse.json(
      { message: "Failed to send connection request" },
      { status: 500 }
    )
  }
} 