import './create-question.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveQuestion } from 'api/question.ts'

import { emptyQuestionFormData, QuestionEditForm, type QuestionFormData, toQuestionApiData } from './form'

export function CreateQuestionContainer() {
    const [searchParams] = useSearchParams()
    const workspaceGuid = searchParams.get('workspaceguid') ? searchParams.get('workspaceguid') : ''
    const navigate = useNavigate()

    const handleSubmit = (questionData: QuestionFormData) => {
        const apiData = { ...toQuestionApiData(questionData), workspaceGuid: workspaceGuid || null }
        saveQuestion(apiData).then(response => {
            const url = workspaceGuid !== '' ? `/workspace/${workspaceGuid}` : `/question/${response.editId}/edit`
            navigate(url)
        })
    }

    return (
        <>
            <h1>Create Question</h1>
            <div className="question-page">
                <QuestionEditForm initialQuestionData={emptyQuestionFormData()} onSubmit={handleSubmit} />
            </div>
        </>
    )
}
