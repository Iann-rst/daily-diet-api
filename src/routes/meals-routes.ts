import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  // registrar uma refeição
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

  // deletar uma refeição especifica
  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          id,
          user_id: sessionId,
        })
        .delete()

      return reply.status(204).send()
    },
  )

  // mostrar todas as refeições cadastradas do usuário
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where({
          user_id: sessionId,
        })
        .orderBy('datetime')

      return reply.status(200).send({
        meals,
      })
    },
  )

  // visualizar uma única refeição
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const schema = z.object({
        id: z.string().uuid(),
      })

      const { id } = schema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals').where({
        id,
        user_id: sessionId,
      })

      return reply.status(200).send({ meal })
    },
  )

  // Editar uma refeição
  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        datetime: z.string().optional(),
        isDiet: z.boolean().optional(),
      })

      const schema = z.object({
        id: z.string().uuid(),
      })

      const { name, description, datetime, isDiet } = updateBodySchema.parse(
        request.body,
      )
      const { id } = schema.parse(request.params)
      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          id,
          user_id: sessionId,
        })
        .update({
          name,
          description,
          datetime,
          isDiet,
        })

      return reply.status(200).send({
        message: 'Atualizado com sucesso',
      })
    },
  )
}
