import './env.js'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import fastifyCookie from 'fastify-cookie'
import path from 'path'
import { fileURLToPath } from 'url'
// Import for MongoDB Database
import { connectDB } from './db.js'
import { registerUser } from './accounts/register.js'
import { authorizeUser } from './accounts/authorize.js'
import { logUserIn } from './accounts/logUserIn.js'
import { logUserOut } from './accounts/logUserOut.js'
import { getUserFromCookies } from './accounts/user.js'

// ESM Specific module for Dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    // Fastify Cookie for setting Cookies to Header
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    })

    //   Fastify plugin for hosting static files
    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    })

    app.post('/api/register', {}, async (request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        )
        if (userId) {
          await logUserIn(userId, request, reply)
          reply.send({
            data: {
              status:  'SUCCESS',
              userId
            }
          })
        }
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAIL',
            userId
          }
        })
      }
    })

    app.post('/api/authorize', {}, async (request, reply) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        )
        if (isAuthorized) {
          await logUserIn(userId, request, reply)
          reply.send({
            data: {
              status: 'SUCCESS',
              userId
            }
          })
        }
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAIL',
            userId
          }
        })
      }
    })

    app.post('/api/logout', {}, async (request, reply) => {
      try {
        await logUserOut(request, reply)
        reply.send({
          data: {
            status: 'SUCCESS'
          }
        })
      } catch (e) {
        console.error(e)
          reply.send({
          data: {
            status: 'FAIL'
          }
        })
      }
    })

    app.get('/test', {}, async (request, reply) => {
      try {
        // Verify User Login
        const user = await getUserFromCookies(request, reply)
        // Return User Email, if it exists, otherwise return unauthorized
        if (user?._id) {
          reply.send({
            data: user,
          })
        } else {
          reply.send({
            data: 'User lookup failed',
          })
        }
      } catch (e) {
        throw new Error(e)
      }
    })

    await app.listen(process.env.PORT)
    console.log(`Server Listening on Port ${process.env.PORT}`)
  } catch (error) {
    app.log.error(err)
    process.exit(1)
  }
}

connectDB().then(() => {
  startApp()
})
