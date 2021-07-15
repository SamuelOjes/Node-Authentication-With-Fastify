import jwt from 'jsonwebtoken'

const JWT_Signature = process.env.JWT_SIGNATURE

export async function logUserOut(request, reply) {
    try {
        // Dynamic Import
        const { session } = await import('../session/session.js')
        if (request?.cookies?.refreshToken) {
            const {refreshToken} = request.cookies
            // Decode refresh Token
            const { sessionToken } = jwt.verify(refreshToken, JWT_Signature)
            // Delete database record for session
            await session.deleteOne({ sessionToken })
        }
        // Remove Cookies
        reply.clearCookie('refreshToken').clearCookie("accessToken")
    } catch (e) {
        console.error(e)
    }
}