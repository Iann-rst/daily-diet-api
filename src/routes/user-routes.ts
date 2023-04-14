import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  // registar um usuário
  app.get('/register', async () => {
    const tables = await knex('sqlite_schema').select('*')

    return tables
  })
}
