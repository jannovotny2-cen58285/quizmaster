import type React from 'react'
import type { QuestionListItem } from 'model/question-list-item'
import { QuizCreateForm, type QuizCreateFormData } from './quiz-create-form'

interface QuizEditFormProps {
    questions: readonly QuestionListItem[]
    onSubmit: (data: QuizCreateFormData) => void
}

export const QuizEditForm: React.FC<QuizEditFormProps> = ({ questions, onSubmit }) => {
    // Zatím pouze prázdný formulář, bez předvyplnění hodnot
    return <QuizCreateForm questions={questions} onSubmit={onSubmit} />
}
