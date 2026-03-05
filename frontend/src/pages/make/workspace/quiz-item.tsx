import { LinkButton } from 'pages/components'
import type { QuizListItem } from 'model/quiz-list-item'

interface Props {
    readonly quiz: QuizListItem
    readonly workspaceguid: string
}

export const QuizItem = ({ quiz, workspaceguid }: Props) => (
    <div className="quiz-item question-item">
        <span className="question-text">{quiz.title}</span>
        <LinkButton label="Edit" to={`/quiz/${quiz.id}/edit?workspaceguid=${workspaceguid}`} />
        <LinkButton label="Take" to={`/quiz/${quiz.id}`} />
        <LinkButton label="Statistics" to={`/quiz/${quiz.id}/stats`} />
    </div>
)
