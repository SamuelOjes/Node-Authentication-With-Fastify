import bcrypt from 'bcryptjs'

const { compare } = bcrypt

export async function authorizeUser(email, password) {
  // Import user collection
  const { user } = await import('../user/user.js')
  // Look up user from database
  const userData = await user.findOne({
    'email.address': email,
  })
  // Get user password
  const savedPassword = userData.password
  // Compare password with password in database
  const isAuthorized = await compare(password, savedPassword)
  // Return Boolean of if password is correct - Psuedo codes
  return { isAuthorized, userId: userData._id }
}
