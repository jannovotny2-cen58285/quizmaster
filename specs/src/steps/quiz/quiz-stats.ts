import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectTextToBe, type TableOf } from 'steps/common.ts'
import { Given, Then, When } from 'steps/fixture.ts'
import type { AnswerRaw } from 'steps/question/ops.ts'
import { type QuizMode, emptyQuizBookmark } from 'steps/world/quiz.ts'
import { createQuestionInList, createWorkspace } from 'steps/workspace/ops.ts'

Given(
    /a quiz "(.+?)"(?: in (exam|learn) mode)? with questions?/,
    async function (quizName: string, mode: QuizMode | undefined, data: DataTable) {
        await createWorkspace(this, 'My List')

        for (const row of data.rows()) {
            const [question, answers] = row
            const answerRawTable = {
                raw: () =>
                    answers.split(',').map(a => {
                        const [answer, correct] = a.trim().split(' ')
                        return [answer, correct === '(*)' ? '*' : '', '']
                    }),
            } as TableOf<AnswerRaw>

            await createQuestionInList(this, question, answerRawTable)
        }

        await this.workspacePage.createNewQuiz()
        await this.quizCreatePage.enterQuizName(quizName)

        if (mode) {
            await this.quizCreatePage.selectFeedbackMode(mode)
        }

        for (const [question] of data.rows()) {
            await this.quizCreatePage.selectQuestion(question)
        }

        await this.quizCreatePage.submit()

        // Store quiz bookmark so 'I start quiz "X"' can find it
        await this.workspacePage.takeQuiz(quizName)
        const quizUrl = new URL(this.page.url()).pathname
        this.quizBookmarks[quizName] = { ...emptyQuizBookmark(), url: quizUrl, title: quizName }
        await this.workspacePage.goto(this.workspaceCreatePage.workspaceGuid())
    },
)

Given(/^I take quiz "(.+?)" with answers?$/, async function (quizName: string, data: DataTable) {
    await this.workspacePage.takeQuiz(quizName)
    await this.quizWelcomePage.start()
    const rows = Array.from(data.rows())
    for (let i = 0; i < rows.length; i++) {
        const [, answer] = rows[i]
        await this.takeQuestionPage.selectAnswer(answer)
        await this.questionPage.submit()
    }
    await this.questionPage.evaluate()
    await this.workspacePage.goto(this.workspaceCreatePage.workspaceGuid())
})

When(
    'I take quiz {string} with answers in {int} seconds',
    async function (quizName: string, timer: number, data: DataTable) {
        await this.page.clock.install({ time: new Date() })
        await this.workspacePage.takeQuiz(quizName)
        await this.quizWelcomePage.start()
        const startTime = Date.now()
        const rows = Array.from(data.rows())
        for (let i = 0; i < rows.length; i++) {
            const [, answer] = rows[i]
            await this.takeQuestionPage.selectAnswer(answer)
            await this.questionPage.submit()
        }
        const endTime = Date.now()
        const elapsedTime = endTime - startTime

        await this.page.clock.fastForward(timer * 1000 - elapsedTime)
        await this.questionPage.evaluate()
        await this.workspacePage.goto(this.workspaceCreatePage.workspaceGuid())
    },
)

Then('I see stats page for quiz {string}', async function (quizName: string) {
    const statsPageHeaderElemenLocator = this.quizStatsPage.pageHeadingLocator()

    await expectTextToBe(statsPageHeaderElemenLocator, `Statistics for quiz: ${quizName}`)
})

Then('I see stats table', async function (data: DataTable) {
    const statsTableBodyRowsLocator = this.quizStatsPage.statsTableBodyRowsLocator()
    const actualRowCount = await statsTableBodyRowsLocator.count()

    const expectedRows = data.rows().filter(row => row.some(cell => cell.trim() !== ''))
    const expectedRowCount = expectedRows.length

    await expect(actualRowCount).toBe(expectedRowCount)

    for (let i = 0; i < expectedRows.length; i++) {
        const expectedRow = expectedRows[i]
        const actualRowLocator = statsTableBodyRowsLocator.nth(i)

        for (let j = 0; j < expectedRow.length; j++) {
            const expectedCell = expectedRow[j].trim()
            if (expectedCell !== '') {
                await expectTextToBe(actualRowLocator.locator('td').nth(j), expectedCell)
            }
        }
    }
})
