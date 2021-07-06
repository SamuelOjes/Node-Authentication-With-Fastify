import { client } from '../db.js'

export const session = client.db('NodeAuthApiLocal').collection('session')
