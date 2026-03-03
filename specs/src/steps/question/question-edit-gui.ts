import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import type { TableOf } from 'steps/common.ts'
import { Given, Then, When } from 'steps/fixture.ts'
import {
    addAnswers,
    type AnswerRaw,
    enterAnswer,
    enterAnswerExplanation,
    enterAnswerText,
    enterQuestion,
    enterQuestionExplanation,
    markQuestionAsPartiallyScored,
    markAnswerCorrectness,
    openCreatePage,
    openEditPage,
    saveQuestion,
    submitQuestion,
} from 'steps/question/ops.ts'
import {
    expectAnswer,
    expectDeleteButtonsState,
    expectEmptyAnswers,
    expectErrorCount,
    expectErrorMessages,
} from 'steps/question/expects.ts'

Given('I start creating a question', async function () {
    await openCreatePage(this)
})

Given('I start editing question {string}', async function (bookmark: string) {
    await openEditPage(this, bookmark)
})

When('I enable explanations', async function () {
    await this.questionEditPage.checkShowExplanation()
})

When('I disable explanations', async function () {
    await this.questionEditPage.uncheckShowExplanation()
})

// Title assertions

Then('I see question edit page', async function () {
    await this.questionEditPage.isEditPage()
})

// Field assertions

Then('I see empty question text', async function () {
    const question = await this.questionEditPage.questionValue()
    expect(question).toBe('')
})

Then('I see question text {string}', async function (question: string) {
    const questionValue = await this.questionEditPage.questionValue()
    expect(questionValue).toBe(question)
})

Then(/I see add answer explanations is (unchecked|checked)/, async function (value: string) {
    const answerExplanationsShown = await this.questionEditPage.answerExplanationsVisible()
    expect(answerExplanationsShown).toBe(value === 'checked')
})

Then(/I see explanations are (enabled|disabled)/, async function (value: string) {
    const showExplanation = await this.questionEditPage.showExplanation()
    expect(showExplanation).toBe(value === 'enabled')
})

Then(/the question is (single|multiple) choice/, async function (value: string) {
    const isMultipleChoice = await this.questionEditPage.isMultipleChoice()
    expect(isMultipleChoice).toBe(value === 'multiple')
})

Then(/easy mode is (on|off)/, async function (value: string) {
    const isEasyMode = await this.questionEditPage.isEasyMode()
    expect(isEasyMode).toBe(value === 'on')
})

Then(/easy mode is (available|not available)/, async function (value: string) {
    const isEasyModeVisible = await this.questionEditPage.isEasyModeVisible()
    expect(isEasyModeVisible).toBe(value === 'available')
})

Then('I see explanation fields', async function () {
    const explanationFieldsCount = await this.questionEditPage.countExplanationFields()
    expect(explanationFieldsCount).toBeGreaterThan(0)
})

Then('I do not see explanation fields', async function () {
    const explanationFieldsCount = await this.questionEditPage.countExplanationFields()
    expect(explanationFieldsCount).toBe(0)
})

Then('I see 2 default empty answers', async function () {
    const answerCount = await this.questionEditPage.answerRowCount()
    expect(answerCount).toBe(2)

    await expectEmptyAnswers(this.questionEditPage, 0)
    await expectEmptyAnswers(this.questionEditPage, 1)

    await expectDeleteButtonsState(this.questionEditPage)
})

Then(/I see answer (\d+) as (correct|incorrect)/, async function (index: number, correctness: string) {
    const isCorrect = correctness === 'correct'
    expect(await this.questionEditPage.isAnswerCorrect(index - 1)).toBe(isCorrect)
})

Then(
    /I see answer (\d+) text "([^"]*)", (correct|incorrect), with explanation "([^"]*)"/,
    async function (index: number, answer: string, correctness: string, explanation: string) {
        await expectAnswer(this.questionEditPage, index - 1, answer, correctness === 'correct', explanation)
    },
)

Then('I see the answers fields', async function (data: TableOf<AnswerRaw>) {
    const answers = data.raw()

    expect(await this.questionEditPage.answerRowCount()).toBe(answers.length)

    let i = 0
    for (const [answer, star, explanation] of answers) {
        await expectAnswer(this.questionEditPage, i++, answer, star === '*', explanation || '')
    }
})

Then('I see empty question explanation', async function () {
    const explanation = await this.questionEditPage.questionExplanation()
    expect(explanation).toBe('')
})

Then('I see question explanation {string}', async function (explanation: string) {
    const explanationValue = await this.questionEditPage.questionExplanation()
    expect(explanationValue).toBe(explanation)
})

// Field edits

When('I enter question {string}', async function (question: string) {
    await enterQuestion(this, question)
})

When(/I mark the question as (single|multiple) choice/, async function (choice: string) {
    if (choice === 'single') {
        await this.questionEditPage.setSingleChoice()
    } else {
        await this.questionEditPage.setMultipleChoice()
    }
})

When('I enter answer {int} text {string}', async function (index: number, answer: string) {
    await enterAnswerText(this, index - 1, answer)
})

When('I mark answer {int} as correct', async function (index: number) {
    await markAnswerCorrectness(this, index - 1, true)
})

When('I enter answer {int} explanation {string}', async function (index: number, explanation: string) {
    await enterAnswerExplanation(this, index - 1, explanation)
})

When('I enter answer {int} text {string} and mark it as correct', async function (index: number, answer: string) {
    await enterAnswer(this, index - 1, answer, true, '')
})

When(
    /I enter answer (\d+) text "([^"]*)", (correct|incorrect), with explanation "([^"]*)"/,
    async function (index: number, answer: string, correctness: string, explanation: string) {
        await enterAnswer(this, index - 1, answer, correctness === 'correct', explanation)
    },
)

Given('I enter answers', async function (answerRawTable: TableOf<AnswerRaw>) {
    await addAnswers(this, answerRawTable)
})

When('I add another answer', async function () {
    await this.questionEditPage.addAdditionalAnswer()
})

When('I enter question explanation {string}', async function (explanation: string) {
    await enterQuestionExplanation(this, explanation)
})

When('mark question as partially scored', async function () {
    await markQuestionAsPartiallyScored(this)
})

// Save question

When('I attempt to submit the question', submitQuestion)
When('I submit the question', submitQuestion)

When('I save the question', async function () {
    await saveQuestion(this, 'manual')
})

Then('I see question-take URL and question-edit URL', async function () {
    const takeUrl = await this.questionEditPage.questionUrl()
    const editUrl = await this.questionEditPage.questionEditUrl()

    expect(takeUrl).toBeDefined()
    expect(editUrl).toBeDefined()

    expect(editUrl).toContain('/edit')
    expect(editUrl).not.toContain('/undefined')
})

// Error messages assertions

Then('I see error messages', async function (table: DataTable) {
    const expectedErrors: string[] = table.raw().map(row => row[0])

    await expectErrorMessages(this.questionEditPage, expectedErrors)
})

Then('I see no error messages', async function () {
    await expectErrorCount(this.questionEditPage, 0)
})

Then('I delete answer {int}', async function (answerNumber: number) {
    await this.questionEditPage.deleteAnswer(answerNumber - 1)
})

Then('I can delete {int} answers', async function (buttonCount: number) {
    await expectDeleteButtonsState(this.questionEditPage, buttonCount, false)
})

Then('I see {int} delete buttons disabled', async function (buttonCount: number) {
    await expectDeleteButtonsState(this.questionEditPage, buttonCount, true)
})
