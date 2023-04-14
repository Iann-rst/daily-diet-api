declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: number
      password: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      isDiet: boolean
      datetime: Date
    }
  }
}
