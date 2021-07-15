import mongo from 'mongodb'
import jwt from 'jsonwebtoken'
import { createTokens } from './tokens.js'

const { ObjectId } = mongo

const JWT_Signature = process.env.JWT_SIGNATURE

export async function getUserFromCookies(request, reply) {
  try {
    const { user } = await import('../user/user.js')
    const { session } = await import('../session/session.js')
    // Check to make sure access token exist, using `optional chaining`
    if (request?.cookies?.accessToken) {
      // If Access Token
      const { accessToken } = request.cookies
      // Decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWT_Signature)
      // console.log('decodedAccessToken', decodedAccessToken)
      // Return user from record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      })
    }
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies
      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWT_Signature)
      // Look up session
      const currentSession = await session.findOne({ sessionToken })
      // Confirm session is valid
      if(currentSession.valid){
        // Look up current user
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId)
        })
        // Refresh Token
        await refreshTokens(sessionToken, currentUser._id, reply)
        // Return Current User
        return currentUser
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export async function refreshTokens(sessionToken, userId, reply) {
  try {
    // Create JWT
    const {accessToken, refreshToken} = await createTokens(
      sessionToken,
      userId
    )
    // Set Cookie using JWT

    //   Create Expiry Date for Access Token
    const now = new Date()
    // Get Date 15 days in the future
    const refreshExpires = now.setDate(now.getDate() + 15)
    reply
      //   name, value, object
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        expires: refreshExpires,
      })
      .setCookie('accessToken', accessToken, {
        path: '/',
        domain: 'localhost',
        httpOnly: true,
      })
    } catch (e) {
      console.error(e)
    }
}
