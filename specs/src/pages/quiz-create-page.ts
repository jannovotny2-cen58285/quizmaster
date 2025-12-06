import type { Page } from '@playwright/test'

export class QuizCreatePage {
    constructor(private page: Page) {}
    timeLimitInput = () => this.page.locator('#time-limit')
    passScoreInput = () => this.page.locator('#pass-score')
    questionsInList = () => this.page.locator('.create-quiz > .question-item')
    getQuestion = (question: string) => this.page.locator('label', { hasText: question })
    selectQuestion = async (question: string) => this.page.locator('label', { hasText: question }).click()
    selectRandomizedFunction = () => this.page.locator('#isRandomized').check()
    selectFeedbackMode = async (mode: 'learn' | 'exam') => {
        const value = mode === 'learn' ? 'LEARN' : 'EXAM'
        await this.page.locator(`#mode-${value}`).check()
    }
    selectDifficulty = async (difficulty: 'easy' | 'hard' | 'keep_question') => {
        const value = difficulty === 'easy' ? 'EASY' : difficulty === 'hard' ? 'HARD' : 'KEEP_QUESTION'
        await this.page.locator(`#difficulty-${value}`).check()
    }

    feedbackModeElement = () => {
        return this.page.locator('#mode')
    }
    private submitLocator = () => this.page.locator('button[type="submit"]')
    submit = () => this.submitLocator().click()

    getQuizTitleValue = () => this.page.locator('#quiz-title').inputValue()
    getQuizDescriptionValue = () => this.page.locator('#quiz-description').inputValue()
    enterQuizName = (title: string) => this.page.locator('#quiz-title').fill(title)
    enterQuizFinalCount = (finalCount: string) => this.page.locator('#quiz-finalCount').fill(finalCount.toString())
    enterDescription = (description: string) => this.page.locator('#quiz-description').fill(description)
    errorMessageLocator = () => this.page.locator('.alert.error')
    hasError = (errorTestId: string) => {
        const result = this.page.getByTestId(errorTestId)
        console.log(result)
        return result.isVisible()
    }
    clearTimeLimit = () => this.timeLimitInput().fill('')
    clearScore = () => this.passScoreInput().fill('')
    hasAnyError = () => this.page.locator('.alert.error').isVisible()
    enterFilterString = (filter: string) => this.page.locator('#question-filter').fill(filter)
    selectedQuestionCountForQuiz = async () => this.page.locator('#selected-question-count-for-quiz').innerHTML()
    totalQuestionCountForQuiz = async () => this.page.locator('#total-question-count-for-quiz').innerHTML()
}
