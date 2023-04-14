export interface Meal {
  id: string
  user_id: string
  name: string
  description: string
  isDiet: boolean
  datetime: Date
}

export function bestDietMealSequence(meals: Meal[]) {
  // melhor sequencia de refeições dentro da dieta
  let sequence = 0
  let bestSequence = 0

  meals.forEach((meal) => {
    if (meal.isDiet) {
      sequence++
    } else {
      sequence = 0
    }

    if (sequence > bestSequence) {
      bestSequence = sequence
    }
  })

  return bestSequence
}
