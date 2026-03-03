import { expect } from '@playwright/test'

import type { QuestionEditPage, TakeQuestionPage } from 'pages'
import { expectTextToBe } from 'steps/common.ts'
import type { Question } from 'steps/world'

export const expectQuestion = async (takeQuestionPage: TakeQuestionPage, question: Question) => {
    expect(await takeQuestionPage.questionText()).toBe(question.question)
    const answers = question.answers
    const answerLocators = takeQuestionPage.answersLocator()

    expect(await answerLocators.count()).toBe(answers.length)

    for (const [index, { answer }] of answers.entries()) {
        const answerLocator = answerLocators.nth(index)
        await expectTextToBe(answerLocator, answer)
    }
}

export const expectAnswer = async (
    page: QuestionEditPage,
    index: number,
    answer: string,
    isCorrect: boolean,
    explanation: string,
) => {
    expect(await page.answerText(index)).toBe(answer)
    expect(await page.isAnswerCorrect(index)).toBe(isCorrect)
    expect(await page.answerExplanation(index)).toBe(explanation)
}

export const expectEmptyAnswers = (page: QuestionEditPage, index: number) => expectAnswer(page, index, '', false, '')

export const expectDeleteButtonsState = async (page: QuestionEditPage, expectedBtnCount = 2, expectDisabled = true) => {
    const trashIconButtons = page.answerDeleteButtonsLocator()

    await expect(trashIconButtons).toHaveCount(expectedBtnCount)
    const btnCount = await trashIconButtons.count()

    for (let i = 0; i < btnCount; i++) {
        const trashIconBtn = trashIconButtons.nth(i)
        await expect(trashIconBtn).toBeVisible()
        if (expectDisabled) {
            await expect(trashIconBtn).toBeDisabled()
        } else {
            await expect(trashIconBtn).toBeEnabled()
        }
    }
}

export const expectErrorCount = async (page: QuestionEditPage, n: number) => {
    const errorCount = await page.errorMessageCount()
    expect(errorCount).toBe(n)
}

export const expectErrorMessages = async (page: QuestionEditPage, expectedErrors: string[]) => {
    await expectErrorCount(page, expectedErrors.length)

    for (const error of expectedErrors) {
        await page.hasError(error)
    }
}

const answerRowClass: { [key in string]: string } = {
    '🟩': 'correctly-selected',
    '🟥': 'incorrect',
    '◼️': 'correctly-not-selected',
}

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })

export const expectColorFeedback = async (takeQuestionPage: TakeQuestionPage, rows: Record<string, string>[]) => {
    for (const { answer, color } of rows) {
        const graphemes = Array.from(segmenter.segment(color), s => s.segment)
        const className = answerRowClass[graphemes[0]]

        const answerRow = takeQuestionPage.answerRowLocator(answer)
        await expect(answerRow).toHaveClass(new RegExp(className))
    }
}
