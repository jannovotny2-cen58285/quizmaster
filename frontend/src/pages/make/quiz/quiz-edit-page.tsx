import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspaceQuestions } from 'api/workspace'
import { urls, useWorkspaceId } from 'urls.ts'

import type { QuestionListItem } from 'model/question-list-item.ts'
import type { Quiz } from 'model/quiz.ts'
import { postQuiz, fetchQuiz, putQuiz } from 'api/quiz'
import { QuizEditForm, type QuizEditFormData } from './quiz-edit-form'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'

export const QuizEditPage = () => {
    const workspaceId = useWorkspaceId()
    const navigate = useNavigate()
    const { id: quizId } = useParams()

    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuestionListItem[]>([])
    const [quiz, setQuiz] = useState<Quiz | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(workspaceId, fetchWorkspaceQuestions, setWorkspaceQuestions)
    useApi(quizId, fetchQuiz, setQuiz)

    const onSubmit = (data: QuizEditFormData) =>
        tryCatch(setErrorMessage, async () => {
            if (quizId) {
                await putQuiz(data, quizId)
            } else {
                await postQuiz(data)
            }
            navigate(urls.workspace(workspaceId))
        })

    const isEdit = quizId !== undefined
    const title = isEdit ? 'Edit Quiz' : 'Create Quiz'
    const pageId = isEdit ? 'edit-quiz-page' : 'create-quiz-page'

    return (
        <Page title={title} id={pageId}>
            <QuizEditForm quiz={quiz} questions={workspaceQuestions} onSubmit={onSubmit} />
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
        </Page>
    )
}
