import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { Given, Then } from 'steps/fixture.ts'
import { createQuizViaUI } from 'steps/quiz/ops.ts'
import { parseKey } from 'steps/world'

Given('a quiz {string} with all questions', async function (quizName: string, properties?: DataTable) {
    const allBookmarks = Object.keys(this.questionBookmarks)
    await createQuizViaUI(this, quizName, allBookmarks, properties)
})

Given(
    'a quiz {string} with questions {string}',
    async function (quizName: string, bookmarkList: string, properties?: DataTable) {
        const bookmarks = parseKey(bookmarkList)
        await createQuizViaUI(this, quizName, bookmarks, properties)
    },
)

Then('I see selected question count {int}', async function (expectedCount: number) {
    const actualCount = await this.quizCreatePage.selectedQuestionCountForQuiz()
    expect(Number.parseInt(actualCount || '0')).toBe(expectedCount)
})

Then('I see total question count {int}', async function (expectedCount: number) {
    const actualCount = await this.quizCreatePage.totalQuestionCountForQuiz()
    expect(Number.parseInt(actualCount || '0')).toBe(expectedCount)
})
