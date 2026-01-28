import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspaceQuestions } from 'api/workspace'
import { useWorkspaceGuid } from 'urls.ts'

import type { QuestionListItem } from 'model/question-list-item.ts'
import { QuizEditForm } from './quiz-edit-form'
import { fetchQuiz } from 'api/quiz'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'
import type { Quiz } from 'model/quiz'

export const QuizEditPage = () => {
    const workspaceGuid = useWorkspaceGuid()
    const navigate = useNavigate()
    const { id: quizId } = useParams()

    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuestionListItem[]>([])
    const [quiz, setQuiz] = useState<Quiz | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(workspaceGuid, fetchWorkspaceQuestions, setWorkspaceQuestions)

    useEffect(() => {
        if (!quizId) {
            setErrorMessage('Quiz ID is missing in URL.')
            setLoading(false)
            return
        }
        setLoading(true)
        fetchQuiz(quizId)
            .then(setQuiz)
            .catch(() => setErrorMessage('Failed to load quiz.'))
            .finally(() => setLoading(false))
    }, [quizId])

    const onSubmit = () =>
        tryCatch(setErrorMessage, async () => {
            // zatím pouze navigace zpět
            if (workspaceGuid) {
                navigate(`/workspace/${workspaceGuid}`)
            }
        })

    return (
        <Page title="Edit Quiz" id="edit-quiz-page">
            {loading ? (
                <div>Loading quiz...</div>
            ) : quiz ? (
                <QuizEditForm questions={workspaceQuestions} quiz={quiz} onSubmit={onSubmit} />
            ) : null}
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
        </Page>
    )
}
