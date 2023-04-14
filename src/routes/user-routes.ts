import { hash } from 'bcryptjs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { Meal, bestDietMealSequence } from '../utils/best-diet-meal-sequence'

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

  /* 
  Deve ser possível recuperar as métricas de um usuário:
    - Quantidade total de refeições registradas;
    - Quantidade total de refeições dentro da dieta;
    - Quantidade total de refeições fora da dieta;
    - Melhor sequência por dia de refeições dentro da dieta;
  */

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sessionId } = request.cookies

      // total de refeições registradas
      const [{ numberOfMeals }] = await knex('meals')
        .where({
          user_id: sessionId,
        })
        .count('id', { as: 'numberOfMeals' })

      // Quantidade total de refeições dentro da dieta;
      const [{ numberOfMealsInDiet }] = await knex('meals')
        .where({
          user_id: sessionId,
          isDiet: true,
        })
        .count('id', { as: 'numberOfMealsInDiet' })

      // Quantidade total de refeições fora da dieta;
      const [{ numberOfMealsOutDiet }] = await knex('meals')
        .where({
          user_id: sessionId,
          isDiet: false,
        })
        .count('id', { as: 'numberOfMealsOutDiet' })

      const meals: Meal[] = await knex('meals')
        .where({
          user_id: sessionId,
        })
        .orderBy('datetime')

      const bestSequence = bestDietMealSequence(meals)

      return reply.status(200).send({
        numberOfMeals,
        numberOfMealsInDiet,
        numberOfMealsOutDiet,
        bestSequence,
      })
    },
  )
}
