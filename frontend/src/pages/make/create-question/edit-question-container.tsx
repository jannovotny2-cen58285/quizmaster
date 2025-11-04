import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from 'api/hooks'
import { fetchQuestionByEditId, updateQuestion } from 'api/question.ts'

import {
    emptyQuestionFormData,
    QuestionEditForm,
    type QuestionFormData,
    toQuestionApiData,
    toQuestionFormData,
} from './form'
import { LoadedIndicator, QuestionEditLink, QuestionLink } from './components.tsx'

export function EditQuestionContainer() {
    const params = useParams()
    const questionEditId = params.id || ''

    const [questionData, setQuestionData] = useState(emptyQuestionFormData())

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [linkToQuestion, setLinkToQuestion] = useState<string>('')
    const [linkToEditQuestion, setLinkToEditQuestion] = useState<string>('')

    useApi(questionEditId, fetchQuestionByEditId, question => {
        setQuestionData(toQuestionFormData(question))
        setLinkToQuestion(`${location.origin}/question/${question.id}`)
        setLinkToEditQuestion(`${location.origin}/question/${questionEditId}/edit`)
        setIsLoaded(true)
    })

    const handleSubmit = (questionData: QuestionFormData) => {
        const apiData = toQuestionApiData(questionData)
        updateQuestion(apiData, questionEditId)
    }

    return (
        <>
            <h1 data-testid="edit-question-title">Edit Question</h1>
            <div className="question-page">
                <QuestionEditForm
                    key={questionData.question}
                    initialQuestionData={questionData}
                    onSubmit={handleSubmit}
                />
                <QuestionLink url={linkToQuestion} />
                <QuestionEditLink editUrl={linkToEditQuestion} />
                <LoadedIndicator isLoaded={isLoaded} />
            </div>
        </>
    )
}
