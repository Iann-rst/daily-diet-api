import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const registerBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        datetime: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, datetime, isDiet } = registerBodySchema.parse(
        request.body,
      )

      const { sessionId } = request.cookies

      await knex('meals').insert({
        id: crypto.randomUUID(),
        name,
        description,
        isDiet,
        datetime,
        user_id: sessionId,
      })

      return reply.status(201).send()
    },
  )
}
