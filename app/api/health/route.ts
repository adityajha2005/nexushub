// Add this new file to check system health
export async function GET() {
  try {
    await connectDB()
    return new Response('OK', { status: 200 })
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
} 