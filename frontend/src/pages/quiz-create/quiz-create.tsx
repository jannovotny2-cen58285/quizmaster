import { useParams } from 'react-router-dom'

export const QuizCreatePage = () => {
    const params = useParams()
    const listId = params.listguid

    return (
        <div>
            <h2>Create Quiz</h2>
            <div>List UUID: {listId}</div>
        </div>
    )
}
