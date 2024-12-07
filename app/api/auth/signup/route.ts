import { NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    })

    if (!user) {
      throw new Error("Failed to create user")
    }

    return NextResponse.json({ 
      success: true,
      message: "Account created successfully"
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: "An error occurred during signup" },
      { status: 500 }
    )
  }
} 