import { useEffect, useMemo, useState } from 'react'

import { useStateSet } from 'helpers'
import type { QuestionListItem } from 'model/question-list-item.ts'
import type { Quiz } from 'model/quiz.ts'
import type { QuizMode, Difficulty } from 'model/quiz.ts'
import type { QuizCreateRequest } from 'api/quiz.ts'

export type QuizEditFormData = QuizCreateRequest

export const useQuizFormState = (questions: readonly QuestionListItem[], quiz?: Quiz) => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedIds, toggleSelectedId, addSelectedId] = useStateSet<number>()
    const [timeLimit, setTimeLimit] = useState<number>(600)
    const [randomQuestionCount, setRandomQuestionCount] = useState<number>(0)
    const [passScore, setPassScore] = useState<number>(80)
    const [filter, setFilter] = useState<string>('')
    const [checkRandomize, setCheckRandomize] = useState(false)
    const [feedbackMode, setFeedbackMode] = useState<QuizMode>('exam')
    const [difficulty, setDifficulty] = useState<Difficulty>('keep-question')

    const [isInitialized, setIsInitialized] = useState(false)
    useEffect(() => {
        if (quiz && !isInitialized) {
            setTitle(quiz.title || '')
            setDescription(quiz.description || '')
            setTimeLimit(quiz.timeLimit ?? 600)
            setRandomQuestionCount(quiz.randomQuestionCount ?? 0)
            setPassScore(quiz.passScore ?? 80)
            setFeedbackMode(quiz.mode || 'exam')
            setDifficulty(quiz.difficulty || 'keep-question')
            setCheckRandomize(!!quiz.randomQuestionCount)
            if (quiz.questions) {
                for (const q of quiz.questions) {
                    addSelectedId(q.id)
                }
            }
            setIsInitialized(true)
        }
    }, [quiz, addSelectedId, isInitialized])

    const filteredQuestions = useMemo(() => {
        if (filter === '') return questions
        return questions.filter(q => q.question.toLowerCase().includes(filter.toLowerCase()))
    }, [filter, questions])

    return {
        title,
        description,
        selectedIds,
        timeLimit,
        randomQuestionCount,
        passScore,
        filter,
        checkRandomize,
        filteredQuestions,
        feedbackMode,
        difficulty,
        setTitle,
        setDescription,
        toggleSelectedId,
        setTimeLimit,
        setRandomQuestionCount,
        setPassScore,
        setFilter,
        setCheckRandomize,
        setFeedbackMode,
        setDifficulty,
    }
}

export const stateToQuizApiData = (
    state: ReturnType<typeof useQuizFormState>,
    workspaceId: string | null,
): QuizEditFormData => ({
    title: state.title,
    description: state.description,
    questionIds: Array.from(state.selectedIds),
    mode: state.feedbackMode,
    difficulty: state.difficulty,
    passScore: state.passScore,
    timeLimit: state.timeLimit,
    workspaceGuid: workspaceId,
    randomQuestionCount: state.randomQuestionCount,
})
