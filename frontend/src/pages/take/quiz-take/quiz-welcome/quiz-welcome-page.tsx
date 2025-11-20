import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { Quiz } from 'model/quiz.ts'
import { useApi } from 'api/hooks.ts'
import { fetchQuiz } from 'api/quiz.ts'
import { QuizDetails } from './quiz-details.tsx'

export const QuizWelcomePage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()

    useApi(params.id, fetchQuiz, setQuiz)

    const onStart = async () => {
        const quizId = params.id
        await fetch(`/api/quiz/${quizId}/start`, {
            method: 'PUT',
        })
        navigate(`/quiz/${quizId}/questions`)
        sessionStorage.removeItem('quizAnswers')
    }

    return quiz && <QuizDetails quiz={quiz} onStart={onStart} />
}
