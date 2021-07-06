import mongo from 'mongodb'
import jwt from 'jsonwebtoken'

const { ObjectId } = mongo

const JWT_Signature = process.env.JWT_SIGNATURE

export async function getUserFromCookies(request) {
  try {
    const { user } = await import('../user/user.js')
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
      const decodedRefreshToken = jwt.verify(refreshToken, JWT_Signature)
      console.log('decocedRefreshToken', decodedRefreshToken)
    }
    // Look up session
    // Confirm session is valid
    // If session is valid, refresh token
    // Look up current user
    // Refresh tokens
    // Return current user
  } catch (e) {
    console.error(e)
  }
}

export async function refreshToken() {
  try {
  } catch (e) {
    console.error(e)
  }
}
