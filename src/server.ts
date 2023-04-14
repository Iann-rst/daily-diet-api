import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { env } from './env'
import { userRoutes } from './routes/user-routes'

const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: '/users',
})

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
