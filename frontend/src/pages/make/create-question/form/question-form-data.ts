import type { AnswerIdxs } from 'model/question'
import type { QuestionApiData } from 'api/question'

export interface AnswerData {
    readonly answer: string
    readonly isCorrect: boolean
    readonly explanation: string
}

export const emptyAnswerData = (): AnswerData => ({ answer: '', isCorrect: false, explanation: '' })

export interface QuestionFormData {
    readonly question: string
    readonly answers: readonly AnswerData[]
    readonly questionExplanation: string
    readonly isMultipleChoice: boolean
    readonly workspaceGuid: string | null
    readonly isEasyModeChoice: boolean
}

export const emptyQuestionFormData = (): QuestionFormData => ({
    question: '',
    answers: [emptyAnswerData(), emptyAnswerData()],
    questionExplanation: '',
    isMultipleChoice: false,
    workspaceGuid: '',
    isEasyModeChoice: false,
})

export const toQuestionFormData = (questionData: QuestionApiData): QuestionFormData => {
    const answerData = questionData.answers.map((answer, index) => ({
        answer,
        isCorrect: questionData.correctAnswers.includes(index),
        explanation: questionData.explanations[index],
    }))

    return {
        question: questionData.question,
        answers: answerData,
        questionExplanation: questionData.questionExplanation,
        isMultipleChoice: questionData.correctAnswers.length > 1,
        workspaceGuid: questionData.workspaceGuid,
        isEasyModeChoice: questionData.easyMode,
    }
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
