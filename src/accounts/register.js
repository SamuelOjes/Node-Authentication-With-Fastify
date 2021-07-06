import bcrypt from 'bcryptjs'

const { genSalt, hash } = bcrypt

export async function registerUser(email, password) {
  const { user } = await import('../user/user.js')

  // Generate Salt
  const salt = await genSalt(10)

  // Hash with salt
  const hashedPassword = await hash(password, salt)
 
  // Store in database
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  })

  // Return User from Database
  return result.insertedId
}
