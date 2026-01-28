import { expect } from '@playwright/test'

import { Given, Then, When } from 'steps/fixture.ts'
import { emptyQuestion } from 'steps/world'

Given(
    'numerical question {string} with correct answer {string}',
    async function (question: string, correctAnswer: string) {
        const params = new URLSearchParams({ question, correct: correctAnswer })
        const url = `/test-numerical-question?${params.toString()}`

        const bookmark = question
        this.questionBookmarks[bookmark] = {
            ...emptyQuestion(),
            question,
            url,
            answers: [{ answer: correctAnswer, isCorrect: true, explanation: '' }],
        }
        this.activeQuestionBookmark = bookmark
    },
)

Then('I see a number input', async function () {
    await expect(this.page.locator('input[type="number"]')).toBeVisible()
})

When('I enter {string}', async function (answer: string) {
    await this.page.fill('input[type="number"]', answer)
    await this.page.click('#submit-answer')
})
