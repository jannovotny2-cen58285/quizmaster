import type { ErrorCode } from './error-message.ts'
import type { QuestionFormState } from './question-form-state.ts'

export function validateQuestionFormState(state: QuestionFormState): Set<ErrorCode> {
    const errors = new Set<ErrorCode>()

    const correctAnswerCount = state.correctAnswers.length
    const emptyAnswerCount = state.answers.filter(answer => answer.trim() === '').length
    const emptyExplanationCount = state.explanations.filter(explanation => explanation.trim() === '').length
    const nonEmptyExplanationCount = state.explanations.filter(explanation => explanation.trim() !== '').length

    if (state.questionText === '') errors.add('empty-question')
    if (emptyAnswerCount > 0) errors.add('empty-answer')
    if (correctAnswerCount === 0) errors.add('no-correct-answer')
    if (state.isMultipleChoice && correctAnswerCount < 2) errors.add('multiple-choice-must-have-more-correct-answers')
    if (emptyExplanationCount > 0 && nonEmptyExplanationCount > 0) errors.add('empty-answer-explanation')

    return errors
}
