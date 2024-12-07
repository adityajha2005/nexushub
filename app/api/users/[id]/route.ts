import { NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDB()

    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("token")

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Please login to continue" },
        { status: 401 }
      )
    }

    try {
      // Verify token
      jwt.verify(token.value, process.env.JWT_SECRET as string)
    } catch (error) {
      return NextResponse.json(
        { message: "Session expired. Please login again" },
        { status: 401 }
      )
    }

    // Find user by ID
    const user = await User.findById(params.id).select("-password")
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    return NextResponse.json(
      { user },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch user" }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 