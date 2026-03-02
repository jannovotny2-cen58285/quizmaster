import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { Given, Then } from 'steps/fixture.ts'
import { type QuizmasterWorld, type QuizMode, type Difficulty, parseKey, emptyQuizBookmark } from 'steps/world'

const toDifficulty = (difficulty: string): Difficulty | undefined => {
    const mapping: Record<string, Difficulty> = {
        'Keep Question': 'keep-question',
        Easy: 'easy',
        Hard: 'hard',
    }
    return mapping[difficulty]
}

const createQuizViaUI = async (
    world: QuizmasterWorld,
    quizName: string,
    questionBookmarks: string[],
    properties?: DataTable,
) => {
    await world.workspacePage.createNewQuiz()
    await world.quizCreatePage.enterQuizName(quizName)

    for (const bookmark of questionBookmarks) {
        const question = world.questionBookmarks[bookmark]
        if (!question) throw new Error(`Question bookmark "${bookmark}" not found`)
        await world.quizCreatePage.selectQuestion(question.question)
    }

    if (properties) {
        const props = Object.fromEntries(properties.raw())

        if (props.description) {
            await world.quizCreatePage.enterDescription(props.description)
        }

        if (props.mode) {
            await world.quizCreatePage.selectFeedbackMode(props.mode as QuizMode)
        }

        if (props['pass score']) {
            await world.quizCreatePage.passScoreInput().fill(props['pass score'])
        }

        if (props['time limit']) {
            await world.quizCreatePage.timeLimitInput().fill(props['time limit'])
        }

        if (props.difficulty) {
            const difficulty = toDifficulty(props.difficulty)
            if (difficulty) await world.quizCreatePage.selectDifficulty(difficulty)
        }

        if (props.size) {
            await world.quizCreatePage.selectRandomizedFunction()
            await world.quizCreatePage.enterQuizFinalCount(props.size)
        }
    }

    await world.quizCreatePage.submit()

    // Store quiz bookmark so 'I start quiz "X"' can find it
    await world.workspacePage.takeQuiz(quizName)
    const quizUrl = new URL(world.page.url()).pathname
    world.quizBookmarks[quizName] = { ...emptyQuizBookmark(), url: quizUrl, title: quizName }
    world.activeQuizBookmark = quizName
    await world.workspacePage.goto(world.workspaceCreatePage.workspaceGuid())
}

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
