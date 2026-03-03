import type { QuizmasterWorld } from 'steps/world'

export const openQuiz = async (world: QuizmasterWorld, quizId: string) => {
    const quizUrl = world.quizBookmarks[quizId]?.url || `/quiz/${quizId}`
    await world.page.goto(quizUrl)
}

export const startQuiz = async (world: QuizmasterWorld, quizId: string) => {
    await openQuiz(world, quizId)
    await world.quizWelcomePage.start()
}
