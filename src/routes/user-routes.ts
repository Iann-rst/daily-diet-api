import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  // registrar um usuário
  app.post('/register', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const password_hash = await hash(password, 6)
    const id = crypto.randomUUID()

    // criar o usuário
    await knex('users').insert({
      id,
      name,
      email,
      password: password_hash,
    })

    // guarda o id do usuário como cookie para as próximas requisições
    const sessionId = id
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })

  // login - fazer o login com email e password e retorna o cookie (sessionId do usuário)
  app.post('/login', () => {})
}
