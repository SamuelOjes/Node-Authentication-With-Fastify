import { client } from '../db.js'

export const user = client.db("NodeAuthApiLocal").collection("user")