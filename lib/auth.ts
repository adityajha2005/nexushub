import jwt from 'jsonwebtoken'

export async function verifyAuth(token: string) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    return verified
  } catch (error) {
    console.error('Token verification error:', error)
    throw new Error('Invalid token')
  }
} 