import { randomBytes } from 'crypto'

export async function createSession(userId, connection) {
  try {
    // Generate A session Token
    const sessionToken = randomBytes(43).toString('hex')
    // Retrieve connection information
    const { ip, userAgent } = connection
    // Database insert for session
    const { session } = await import('../session/session.js')
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    // Return session Token
    return sessionToken
  } catch (e) {
    throw new Error('Session Creation Failed')
  }
}
