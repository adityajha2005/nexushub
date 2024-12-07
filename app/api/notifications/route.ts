import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Notification from "@/models/Notification"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const userId = decoded.id

    await connectDB()

    const notifications = await Notification.find({ 
      recipient: userId 
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar')
    .lean()

    return NextResponse.json({ 
      notifications: notifications.map(notification => ({
        _id: notification._id,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        from: {
          name: notification.sender.name,
          avatar: notification.sender.avatar
        }
      }))
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      message: "Failed to fetch notifications",
      notifications: []
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const userId = decoded.id

    const { notificationIds } = await request.json()
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ message: "Invalid notification IDs" }, { status: 400 })
    }

    await connectDB()

    await Notification.updateMany(
      { 
        _id: { $in: notificationIds },
        recipient: userId
      },
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