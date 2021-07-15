// Import MongoDb
import mongo from 'mongodb'

const { MongoClient } = mongo

// Import MongoDb URL String
const mongoUrl = process.env.MONGO_URL
const local_mongoUrl = process.env.LOCAL_MONGO_URL

// MongoDb Connection Setup
export const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export async function connectDB() {
  try {
    await client.connect()
    // Confirm Connection To DB
    await client.db('admin').command({ ping: 1 })
    console.log('Connected to DB successfully 🗄')
  } catch (e) {
    console.error(e)
    // Error?  Close Database Connection
    await client.close()
  }
}
