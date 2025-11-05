import type { Page } from '@playwright/test'

export class QuestionEditPage {
    constructor(private page: Page) {}

    gotoNew = () => this.page.goto('/question/new', { waitUntil: 'networkidle' })
    gotoEdit = (url: string) => this.page.goto(url, { waitUntil: 'networkidle' })

    waitForLoaded = () => this.page.isHidden('#is-loaded[value="loaded"]')
    waitForEditButton = () => this.page.waitForSelector('.edit-question')
    waitForLoadedTitle = () => this.page.waitForSelector('#question-page-title')

    private editQuestionTitleLocator = () => this.page.locator('[data-testid="edit-question-title"]')
    editQuestionTitle = () => this.editQuestionTitleLocator().textContent()
    isCreatePage = () => this.page.locator('[data-testid="create-question-title"]').isVisible()
    isEditPage = () => this.page.locator('[data-testid="edit-question-title"]').isVisible()

    private questionLocator = () => this.page.locator('#question-text')
    enterQuestion = (question: string) => this.questionLocator().fill(question)
    questionValue = () => this.questionLocator().inputValue()

    private multipleChoiceLocator = () => this.page.locator('#is-multiple-choice')
    isMultipleChoice = () => this.multipleChoiceLocator().isChecked()
    setMultipleChoice = () => this.multipleChoiceLocator().check()
    setSingleChoice = () => this.multipleChoiceLocator().uncheck()

    private easyModeLocator = () => this.page.locator('#easy-mode')
    isEasyMode = () => this.easyModeLocator().isChecked()
    setEasyModeChecked = () => this.easyModeLocator().check()
    setEasyModeUnchecked = () => this.easyModeLocator().uncheck()
    isEasyModeVisible = () => this.easyModeLocator().isVisible()

    // deprecated
    isCorrectCheckboxLocator = (answerText: string) =>
        this.page.locator(`.answer-row input[value="${answerText}"]+input[type="checkbox"]`)

    // deprecated
    isCorrectCheckboxesLocator = () => this.page.locator('.answer-row input[type="checkbox"]')

    private answerRowsLocator = () => this.page.locator('.answer-row')
    answerRowCount = () => this.answerRowsLocator().count()

    private answerRowLocator = (index: number) => this.page.locator(`.answer-row`).nth(index)
    private answerTextLocator = (index: number) => this.answerRowLocator(index).locator('input.text')
    enterAnswerText = (index: number, value: string) => this.answerTextLocator(index).fill(value)
    answerText = (index: number) => this.answerTextLocator(index).inputValue()

    private answerIsCorrectLocator = (index: number) =>
        this.answerRowLocator(index).locator('input[type="checkbox"], input[type="radio"]')
    isAnswerCorrect = (index: number) => this.answerIsCorrectLocator(index).isChecked()
    setAnswerCorrectness = (index: number, isCorrect: boolean) =>
        this.answerIsCorrectLocator(index).setChecked(isCorrect)

    private answerExplanationLocator = (index: number) => this.answerRowLocator(index).locator('input.explanation')
    answerExplanation = (index: number) => this.answerExplanationLocator(index).inputValue()
    enterAnswerExplanation = (index: number, explanation: string) =>
        this.answerExplanationLocator(index).fill(explanation)

    enterAnswer = async (index: number, value: string, correct: boolean, explanation: string) => {
        await this.enterAnswerText(index, value)
        await this.setAnswerCorrectness(index, correct)
        await this.enterAnswerExplanation(index, explanation)
    }

    private addAnswerButtonLocator = () => this.page.locator('button#add-answer')
    private addDeleteQuestionButtonLocator = () => this.page.locator('[data-testid="delete-button"]')
    isDeleteQuestionButtonEnabled = () => this.addDeleteQuestionButtonLocator().isEnabled()
    clickDeleteButton = () => this.addDeleteQuestionButtonLocator().click()
    addAdditionalAnswer = async () => {
        const idx = await this.answerRowCount()
        await this.addAnswerButtonLocator().click()
        await this.answerRowLocator(idx).waitFor({ state: 'visible' })
    }

    private questionExplanationLocator = () => this.page.locator('#question-explanation')
    enterQuestionExplanation = (question: string) => this.questionExplanationLocator().fill(question)
    questionExplanation = () => this.questionExplanationLocator().inputValue()

    submit = () => this.page.locator('button[type="submit"]').click()

    private questionUrlLocator = () => this.page.locator('#question-link')
    questionUrl = () => this.questionUrlLocator().textContent()

    private questionEditUrlLocator = () => this.page.locator('#question-edit-link')
    questionEditUrl = () => this.questionEditUrlLocator().textContent()

    hasError = (error: string) => this.page.locator(`.errors .${error}`).waitFor({ state: 'visible' })
    errorMessageCount = () => this.page.locator('.errors > li').count()
}
