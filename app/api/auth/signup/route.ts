import { connectDB } from "@/lib/db"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 