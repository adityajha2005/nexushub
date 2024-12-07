import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Clear the authentication token
    cookieStore.delete('token')

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    )
  }
} 