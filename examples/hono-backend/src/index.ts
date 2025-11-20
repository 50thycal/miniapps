import { createClient, Errors } from '@farcaster/quick-auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { resolveUser } from './resolveUser.js'

const client = createClient()
const app = new Hono<{ Bindings: Cloudflare.Env }>()

const quickAuthMiddleware = createMiddleware<{
  Bindings: Cloudflare.Env
  Variables: {
    user: {
      fid: number
      primaryAddress?: string
    }
  }
}>(async (c, next) => {
  const authorization = c.req.header('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing token' })
  }

  // Check if HOSTNAME env var is configured
  const hostname = c.env?.HOSTNAME
  if (!hostname) {
    throw new HTTPException(500, {
      message: 'Server misconfiguration: HOSTNAME environment variable not set',
    })
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(' ')[1] as string,
      domain: hostname,
    })

    const user = await resolveUser(payload.sub)
    c.set('user', user)
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      throw new HTTPException(401, { message: 'Invalid token' })
    }

    throw e
  }

  await next()
})

app.use(cors())

// Root route - health check / welcome message
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'hono-backend',
    message: 'Farcaster Quick Auth backend for Cloudflare Workers',
    note: 'This backend is designed for Cloudflare Workers. For the mini-app UI, deploy examples/sign-in-test separately.',
    endpoints: {
      '/me': 'GET - Returns authenticated user info (requires Bearer token)',
    },
  })
})

app.get('/me', quickAuthMiddleware, (c) => {
  return c.json(c.get('user'))
})

export default app
