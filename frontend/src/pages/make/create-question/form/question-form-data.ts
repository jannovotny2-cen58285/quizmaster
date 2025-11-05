import type { AnswerIdxs } from 'model/question'
import type { QuestionApiData } from 'api/question'

export interface AnswerData {
    readonly answer: string
    readonly isCorrect: boolean
    readonly explanation: string
}

export interface QuestionFormData {
    readonly question: string
    readonly answers: readonly AnswerData[]
    readonly questionExplanation: string
    readonly isMultipleChoice: boolean
    readonly workspaceGuid: string | null
    readonly isEasyModeChoice: boolean
}

export const toQuestionApiData = (questionData: QuestionFormData): QuestionApiData => {
    const answers = questionData.answers.map(answer => answer.answer)
    const correctAnswers = questionData.answers.reduce(
        (acc, answer, index) => (answer.isCorrect ? acc.concat([index]) : acc),
        [] as AnswerIdxs,
    )
    const explanations = questionData.answers.map(answer => answer.explanation)

    return {
        question: questionData.question,
        editId: '',
        workspaceGuid: questionData.workspaceGuid,
        answers,
        correctAnswers,
        explanations,
        questionExplanation: questionData.questionExplanation,
        easyMode: questionData.isEasyModeChoice,
    }
}

export const stateToQuestionFormData = (state: {
    questionText: string
    answers: readonly string[]
    explanations: readonly string[]
    correctAnswers: readonly number[]
    questionExplanation: string
    isMultipleChoice: boolean
    easyMode: boolean
}): QuestionFormData => {
    const answerData = state.answers.map((answer, index) => ({
        answer,
        isCorrect: state.correctAnswers.includes(index),
        explanation: state.explanations[index] || '',
    }))

    return {
        question: state.questionText,
        answers: answerData,
        questionExplanation: state.questionExplanation,
        isMultipleChoice: state.isMultipleChoice,
        workspaceGuid: '',
        isEasyModeChoice: state.easyMode,
    }
}
