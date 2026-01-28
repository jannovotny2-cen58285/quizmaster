import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useApi } from 'api/hooks'
import { fetchWorkspaceQuestions } from 'api/workspace'
import { useWorkspaceGuid } from 'urls.ts'

import type { QuestionListItem } from 'model/question-list-item.ts'
import { QuizEditForm } from './quiz-edit-form'
import { tryCatch } from 'helpers'
import { Alert, Page } from 'pages/components'

export const QuizEditPage = () => {
    const workspaceGuid = useWorkspaceGuid()
    const navigate = useNavigate()

    const [workspaceQuestions, setWorkspaceQuestions] = useState<readonly QuestionListItem[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')

    useApi(workspaceGuid, fetchWorkspaceQuestions, setWorkspaceQuestions)

    const onSubmit = () =>
        tryCatch(setErrorMessage, async () => {
            // zatím pouze navigace zpět
            if (workspaceGuid) {
                navigate(`/workspace/${workspaceGuid}`)
            }
        })

    return (
        <Page title="Edit Quiz" id="edit-quiz-page">
            <QuizEditForm questions={workspaceQuestions} onSubmit={onSubmit} />
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
        </Page>
    )
}
