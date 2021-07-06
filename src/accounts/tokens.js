import jwt from 'jsonwebtoken'

const JWT_Signature = process.env.JWT_SIGNATURE

export async function createTokens(sessionToken, userId) {
  try {
    //   Create a Refresh Token
    // Session Id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWT_Signature
    )
    // Create Access Token
    // Session Id, User id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWT_Signature
    )
    // Return Refresh Token & Accsess Token
    return { accessToken, refreshToken }
  } catch (e) {
    console.error(e)
  }
}
