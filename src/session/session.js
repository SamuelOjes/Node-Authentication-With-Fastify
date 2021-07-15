import { client } from '../db.js'

export const session = client.db('nodeAuthApi').collection('session')

session.createIndex({sessionToken: 1})