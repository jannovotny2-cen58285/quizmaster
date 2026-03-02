import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectTextToBe } from 'steps/common.ts'
import { Given, Then, When } from 'steps/fixture.ts'

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
