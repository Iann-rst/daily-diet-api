import fastify from 'fastify'
import { env } from './env'
import { userRoutes } from './routes/user-routes'

const app = fastify()

app.register(userRoutes)

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
