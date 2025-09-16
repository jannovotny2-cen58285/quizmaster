import { linkQuestionToList } from 'api/quiz-question'
import { Button, type WithOnClick } from 'pages/components/button'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { QuestionListData } from '.'
import copyClipboardIcon from '../../assets/icons/copy-clipboard.svg'
import { QuestionItem } from './question-item'
import './question-list.scss'

type Props = {
    questionListData?: QuestionListData
    onRefresh?: () => Promise<void>
}

type EditQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type TakeQuestionButtonProps = { id: string; hash: string; onClick: () => void }
type CopyQuestionButtonProps = { id: string; kind: string; hash: string; onClick: () => void }

export const CreateQuestionButton = ({ onClick }: WithOnClick) => (
    <Button id="create-question" onClick={onClick}>
        Create New Question
    </Button>
)

export const EditQuestionButton = ({ id, onClick }: EditQuestionButtonProps) => (
    <Button id={id} className="edit-question" onClick={onClick}>
        Edit
    </Button>
)

export const TakeQuestionButton = ({ id, onClick }: TakeQuestionButtonProps) => (
    <Button id={id} className="take-question" onClick={onClick}>
        Take
    </Button>
)

export const CopyQuestionButton = ({ id, kind, onClick }: CopyQuestionButtonProps) => (
    <Button id={id} className="copy-question" onClick={onClick}>
        <img
            id={`image${kind}${id}`}
            src={copyClipboardIcon}
            alt={`Copy the ${kind} url to clipboard`}
            title={`Copy the ${kind} url to clipboard`}
            style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
            onError={e => {
                e.currentTarget.style.display = 'none'
            }}
        />
    </Button>
)

export const AddExistingQuestion = ({ onClick }: WithOnClick) => (
    <Button id="add-existing-question" onClick={onClick}>
        Add Existing Question
    </Button>
)

export const CreateQuizButton = ({ onClick }: WithOnClick) => (
    <Button id="create-quiz" onClick={onClick}>
        Create Quiz
    </Button>
)

export function QuestionList({ questionListData, onRefresh }: Props) {
    const params = useParams()
    const navigate = useNavigate()
    const [questionId, setQuestionId] = useState<string | undefined>()
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const questionListId = `${params.id}`

    const onCreateNewQuestion = () => {
        navigate(`/question/new?listguid=${questionListId}`)
    }

    const onEditQuestion = (hash: string) => {
        navigate(`/question/${hash}/edit`)
    }

    const onTakeQuestion = (id: number) => {
        navigate(`/question/${id}`)
    }

    const onCopyTakeQuestion = async (id: number) => {
        const link = `${window.location.origin}/question/${id}`
        try {
            await navigator.clipboard.writeText(link)
            window.alert('link copied')
        } catch (err) {
            window.alert('Failed to copy link')
        }
    }

    const onCopyEditQuestion = async (hash: string) => {
        const link = `${window.location.origin}/question/${hash}/edit`
        try {
            await navigator.clipboard.writeText(link)
            window.alert('link copied')
        } catch (err) {
            window.alert('Failed to copy link')
        }
    }

    const onAddExistingQuestion = async () => {
        if (questionId) {
            console.log(`Adding existing question with id: ${questionId}, question list id: ${questionListId}`)
            if (!questionListId) {
                alert('Question list id is missing')
                return
            }
            if (Number.isNaN(Number.parseInt(questionId))) {
                setErrorMessage('Invalid question format')
                return
            }
            const result = await linkQuestionToList(Number.parseInt(questionId), questionListId)
            if (result) {
                // Refresh the question list to show the newly added question
                if (onRefresh) {
                    await onRefresh()
                }
                // Clear the input field
                setQuestionId('')
            } else {
                setErrorMessage('Question not found')
            }
        }
    }

    const onCreateQuiz = () => {
        navigate(`/quiz-create/new?listguid=${questionListId}`)
    }

    return questionListData ? (
        <div className="question-list-page">
            <h1 id="question-title-header" data-testid="question-list-title">
                {questionListData.title}
            </h1>
            <div className="create-button">
                <CreateQuestionButton onClick={onCreateNewQuestion} />
            </div>
            <div className="add-existing-section">
                <input
                    value={questionId}
                    onChange={e => setQuestionId(e.target.value)}
                    id="question-input-field"
                    placeholder="Enter question id"
                />
                <div className="add-button-container">
                    <AddExistingQuestion onClick={onAddExistingQuestion} />
                </div>
                <div id="error-message-label" className="error-message">
                    {errorMessage}
                </div>
            </div>
            <div className="question-holder">
                {questionListData.questions.map((q, index) => (
                    <QuestionItem
                        key={q.id || index}
                        question={q}
                        index={index}
                        onEditQuestion={() => onEditQuestion(q.hash)}
                        onCopyEditQuestion={() => onCopyEditQuestion(q.hash)}
                        onTakeQuestion={() => onTakeQuestion(q.id)}
                        onCopyTakeQuestion={() => onCopyTakeQuestion(q.id)}
                    />
                ))}
            </div>
            <CreateQuizButton onClick={onCreateQuiz} />
        </div>
    ) : null
}
