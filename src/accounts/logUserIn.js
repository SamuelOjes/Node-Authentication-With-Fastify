import { createSession } from './sessions.js'
import { createTokens } from './tokens.js'
import { refreshTokens } from './user.js'

export async function logUserIn(userId, request, reply) {
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }
  // Create Session
  const sessionToken = await createSession(userId, connectionInformation)
  
  // Create JWT
  // Create Expiry Date for Access Token
  // Set Cookie using JWT
  // Get Date 1 days in the future
  // An Abstraction from the refreshToken Function in accounts/user.js
  await refreshTokens(sessionToken, userId, reply)

}
