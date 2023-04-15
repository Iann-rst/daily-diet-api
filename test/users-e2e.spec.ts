import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { app } from '../src/app'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        name: 'Iann Rodrigues',
        email: 'iann@test.com',
        password: '123456',
      })
      .expect(201)
  })
})
