import { expect } from '@playwright/test'

import type { DataTable } from '@cucumber/cucumber'

import type { QuestionPage, QuizCreatePage, QuizScorePage, QuizStatsPage, TakeQuestionPage } from 'pages'
import { expectTextToBe } from 'steps/common.ts'
import type { Answer } from 'steps/world'

export const expectQuizResult = async (
    page: QuizScorePage,
    expectedCorrectAnswers: string,
    expectedTotalQuestions: number,
    expectedPercentage: number,
    expectedTextResult: string,
    expectedPassScore: number,
) => {
    expect(await page.correctAnswers()).toBe(expectedCorrectAnswers)
    expect(await page.totalQuestions()).toBe(expectedTotalQuestions)
    expect(await page.percentageResult()).toBe(expectedPercentage)
    expect(await page.textResult()).toBe(expectedTextResult)
    expect(await page.passScore()).toBe(expectedPassScore)
}

export const expectOriginalResult = async (
    page: QuizScorePage,
    expectedCorrectAnswers: number,
    expectedPercentage: number,
    expectedTextResult: string,
) => {
    expect(await page.firstCorrectAnswers()).toBe(expectedCorrectAnswers)
    expect(await page.firstPercentageResult()).toBe(expectedPercentage)
    expect(await page.firstTextResult()).toBe(expectedTextResult)
}

export const expectOriginalResultNotVisible = async (page: QuizScorePage) => {
    expect(await page.firstCorrectAnswersPresent()).toBe(false)
    expect(await page.firstPercentageResultPresent()).toBe(false)
    expect(await page.firstTextResultPresent()).toBe(false)
}

export const expectAllOptionsForQuestion = async (page: QuizScorePage, question: string, expectedAnswers: Answer[]) => {
    const answers = await page.answers(question)
    expect(answers.length).toBe(expectedAnswers.length)
    for (const answer of expectedAnswers) {
        expect(answers).toContain(answer.answer)
    }
}

export const expectNavigationButtons = async (questionPage: QuestionPage, expectedButtons: string[]) => {
    const buttonLocatorMap: Record<string, () => ReturnType<typeof questionPage.backButtonLocator>> = {
        Back: () => questionPage.backButtonLocator(),
        Next: () => questionPage.nextButtonLocator(),
        Evaluate: () => questionPage.evaluateButtonLocator(),
    }

    for (const name of expectedButtons) {
        const locator = buttonLocatorMap[name]
        if (!locator) throw new Error(`Unknown button: "${name}"`)
        await expect(locator()).toBeVisible()
    }

    await expect(questionPage.navigationButtonsLocator()).toHaveCount(expectedButtons.length)
}

export const expectAnswersChecked = async (takeQuestionPage: TakeQuestionPage, answers: string[], checked: boolean) => {
    for (const answer of answers) {
        if (checked) {
            await expect(takeQuestionPage.answerCheckLocator(answer)).toBeChecked()
        } else {
            await expect(takeQuestionPage.answerCheckLocator(answer)).not.toBeChecked()
        }
    }
}

export const expectStatsTable = async (quizStatsPage: QuizStatsPage, data: DataTable) => {
    const statsTableBodyRowsLocator = quizStatsPage.statsTableBodyRowsLocator()
    const actualRowCount = await statsTableBodyRowsLocator.count()

    const expectedRows = data.rows().filter(row => row.some(cell => cell.trim() !== ''))

    await expect(actualRowCount).toBe(expectedRows.length)

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
}

export const expectCorrectAnswersCounts = (correctAnswersCounts: Record<string, string>, rows: string[][]) => {
    for (const [bookmark, expected] of rows) {
        expect(correctAnswersCounts[bookmark]).toBe(expected)
    }
}

export const expectQuizFormErrors = async (quizCreatePage: QuizCreatePage, expectedErrors: string[]) => {
    for (const error of expectedErrors) {
        const hasError = await quizCreatePage.hasError(error)
        expect(hasError).toBe(true)
    }
}
