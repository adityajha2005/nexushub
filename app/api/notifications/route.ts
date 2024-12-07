import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Notification from "@/models/Notification"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const userId = decoded.id

    await connectDB()

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar')
      .lean()

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      message: "Failed to fetch notifications",
      notifications: []
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { notificationIds } = await request.json()
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ message: "Invalid notification IDs" }, { status: 400 })
    }

    await connectDB()

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { read: true } }
    )

    return NextResponse.json({ message: "Notifications marked as read" })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ 
      message: "Failed to update notifications" 
    }, { status: 500 })
  }
} 