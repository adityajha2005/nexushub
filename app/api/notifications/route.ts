import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    await connectDB()

    const user = await User.findById(decoded.id)
      .populate('notifications.from', 'name avatar')

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ notifications: user.notifications })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// Mark notifications as read
export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { id: string }
    const { notificationIds } = await request.json()

    await connectDB()

    await User.updateOne(
      { _id: decoded.id },
      { 
        $set: { 
          "notifications.$[elem].read": true 
        } 
      },
      { 
        arrayFilters: [{ "elem._id": { $in: notificationIds } }],
        multi: true
      }
    )

    return NextResponse.json({ message: "Notifications marked as read" })
  } catch (error) {
    console.error("Mark notifications error:", error)
    return NextResponse.json(
      { message: "Failed to mark notifications as read" },
      { status: 500 }
    )
  }
} 