import { NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    // Create response with cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 