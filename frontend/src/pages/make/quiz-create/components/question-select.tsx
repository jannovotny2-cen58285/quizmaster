import './question-select.scss'
import type { QuestionListItem } from 'model/question-list-item.ts'

interface QuestionItemProps {
    readonly question: QuestionListItem
    readonly selected: boolean
    readonly onSelect: (id: number) => void
}

export const QuestionItem = ({ question, selected, onSelect }: QuestionItemProps) => {
    const inputId = `question-select-${question.id}`

    return (
        <div key={question.id} className="question-item">
            <input id={inputId} type="checkbox" checked={selected} onChange={() => onSelect(question.id)} />
            <label htmlFor={inputId}>{question.question}</label>
        </div>
    )
}

interface QuestionSelectProps {
    readonly questions: readonly QuestionListItem[]
    readonly selectedIds: ReadonlySet<number>
    readonly onSelect: (id: number) => void
}

export const QuestionSelect = ({ questions, selectedIds, onSelect }: QuestionSelectProps) => (
    <div className="question-select">
        {questions.map(question => (
            <QuestionItem
                key={question.id}
                question={question}
                selected={selectedIds.has(question.id)}
                onSelect={onSelect}
            />
        ))}
    </div>
)
