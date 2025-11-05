import { SubmitButton, Form } from 'pages/components'
import {
    AnswersEdit,
    MultipleChoiceEdit,
    QuestionEdit,
    QuestionExplanationEdit,
    EasyModeChoiceEdit,
} from 'pages/make/create-question/form'
import { useQuestionFormState } from './question-form-state'
import { stateToQuestionFormData, toQuestionApiData } from './question-form-data'
import { useState } from 'react'
import { type ErrorCodes, ErrorMessages } from './error-message.tsx'
import { validateQuestionFormData } from '../validators.ts'
import type { QuestionApiData } from 'api/question.ts'
import type { Question } from 'model/question.ts'

interface QuestionEditProps {
    readonly question?: Question
    readonly onSubmit: (questionData: QuestionApiData) => void
}

export const QuestionEditForm = ({ question, onSubmit }: QuestionEditProps) => {
    const state = useQuestionFormState(question)
    const [errors, setErrors] = useState<ErrorCodes>(new Set())

    const handleMultipleChoiceChange = (isMultipleChoice: boolean) => {
        state.setIsMultipleChoice(isMultipleChoice)

        // When switching to single choice mode, keep only the first correct answer
        if (!isMultipleChoice && state.correctAnswers.length > 1) {
            const firstCorrectAnswer = state.correctAnswers[0]
            // Clear all and set only the first one
            state.correctAnswers.forEach(idx => {
                if (idx !== firstCorrectAnswer) {
                    state.toggleCorrectAnswer(idx)
                }
            })
        }
    }

    const handleSubmit = () => {
        const formData = stateToQuestionFormData(state)
        const errors = validateQuestionFormData(formData)
        setErrors(errors)

        if (errors.size === 0) onSubmit(toQuestionApiData(formData))
    }

    return (
        <Form id="question-create-form" onSubmit={handleSubmit}>
            <QuestionEdit question={state.questionText} setQuestion={state.setQuestionText} />
            <div className="questiion-options">
                <MultipleChoiceEdit
                    isMultipleChoice={state.isMultipleChoice}
                    setIsMultipleChoice={handleMultipleChoiceChange}
                />
                {state.isMultipleChoice && (
                    <EasyModeChoiceEdit
                        isEasyModeChoice={state.easyMode}
                        setIsEasyModeChoice={state.setEasyMode}
                    />
                )}
            </div>
            <AnswersEdit
                answers={state.answers}
                explanations={state.explanations}
                correctAnswers={state.correctAnswers}
                isMultipleChoice={state.isMultipleChoice}
                setAnswer={state.setAnswer}
                setExplanation={state.setExplanation}
                toggleCorrectAnswer={state.toggleCorrectAnswer}
                addAnswer={state.addAnswer}
            />
            <QuestionExplanationEdit
                questionExplanation={state.questionExplanation}
                setQuestionExplanation={state.setQuestionExplanation}
            />
            <div className="flex-container">
                <SubmitButton />
            </div>
            <ErrorMessages errorCodes={errors} />
        </Form>
    )
}
