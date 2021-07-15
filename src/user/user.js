import { client } from '../db.js'

export const user = client.db("nodeAuthApi").collection("user")

user.createIndex({"email.address": 1})