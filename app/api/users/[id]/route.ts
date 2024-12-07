import { NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const user = await User.findById(params.id).select("-password")
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch user" }, 
      { status: 500 }
    )
  }
} 