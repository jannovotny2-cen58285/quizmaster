import { useState } from 'react'
import { updated } from 'helpers.ts'
import type { Question } from 'model/question.ts'

export const useQuestionFormState = (question?: Question) => {
    const [questionText, setQuestionText] = useState<string>(question?.question || '')
    const [isMultipleChoice, setIsMultipleChoice] = useState((question?.correctAnswers?.length || 0) > 1 || false)
    const [easyMode, setEasyMode] = useState(question?.easyMode || false)

    const [answers, setAnswers] = useState<readonly string[]>(question?.answers || ['' , ''])
    const [explanations, setExplanations] = useState<readonly string[]>(question?.explanations || ['', ''])
    const [correctAnswers, setCorrectAnswers] = useState<readonly number[]>(question?.correctAnswers || [])

    const [questionExplanation, setQuestionExplanation] = useState(question?.questionExplanation || '')

    const setAnswer = (index: number, answer: string) =>
        setAnswers(updated(answers, index, answer))

    const setExplanation = (index: number, explanation: string) =>
        setExplanations(updated(explanations, index, explanation))

    const toggleCorrectAnswer = (index: number) => {
        if (isMultipleChoice) {
            // Multiple choice: toggle the index in/out of the array
            setCorrectAnswers(
                correctAnswers.includes(index)
                    ? correctAnswers.filter(i => i !== index)
                    : [...correctAnswers, index]
            )
        } else {
            // Single choice: simulate radio buttons - unset previous, set new
            setCorrectAnswers(correctAnswers.includes(index) ? [] : [index])
        }
    }

    const addAnswer = () => {
        setAnswers([...answers, ''])
        setExplanations([...explanations, ''])
    }

    return {
        questionText,
        answers,
        explanations,
        correctAnswers,
        questionExplanation,
        isMultipleChoice,
        easyMode,

        setQuestionText,
        setAnswer,
        setExplanation,
        toggleCorrectAnswer,
        addAnswer,
        setQuestionExplanation,
        setIsMultipleChoice,
        setEasyMode,
    }
}
