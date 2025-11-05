interface AnswerRowProps {
    readonly answer: string
    readonly explanation: string
    readonly isCorrect: boolean
    readonly index: number
    readonly isMultipleChoice: boolean
    readonly setAnswer: (index: number, answer: string) => void
    readonly setExplanation: (index: number, explanation: string) => void
    readonly toggleCorrectAnswer: (index: number) => void
}

export const AnswerRow = ({
    answer,
    explanation,
    isCorrect,
    index,
    isMultipleChoice,
    setAnswer,
    setExplanation,
    toggleCorrectAnswer,
}: AnswerRowProps) => (
    <div key={`answer-${index}`} className="answer-row" id={`answer-${index}`}>
        <div className="answer-row-section">
            <input
                className={!isMultipleChoice ? 'answer-isCorrect-checkbox' : 'answer-isCorrect-checkbox-multi'}
                type="checkbox"
                checked={isCorrect}
                onChange={() => toggleCorrectAnswer(index)}
            />
            <span className="answer-row-correct-icon">{isCorrect ? '✅' : '❌'}</span>
            <span className="answer-row-correct-text">{isCorrect ? 'Correct answer' : 'Incorrect answer'}</span>
        </div>
        <div className="answer-row-section">
            <input
                className="text"
                type="text"
                placeholder={`Input answer ${index + 1} here...`}
                value={answer}
                onChange={e => setAnswer(index, e.target.value)}
            />
        </div>
        <div className="answer-row-section">
            <input
                className="explanation"
                type="text"
                placeholder="You can add explanation of the anwser here..."
                value={explanation}
                onChange={e => setExplanation(index, e.target.value)}
            />
        </div>
    </div>
)

interface AddAnswerProps {
    readonly addAnswer: () => void
}

export const AddAnswerButton = ({ addAnswer }: AddAnswerProps) => (
    <div>
        <button type="button" onClick={addAnswer} className="secondary button" id="add-answer">
            Add Answer
        </button>
    </div>
)

interface AnswersProps {
    readonly answers: readonly string[]
    readonly explanations: readonly string[]
    readonly correctAnswers: readonly number[]
    readonly isMultipleChoice: boolean
    readonly setAnswer: (index: number, answer: string) => void
    readonly setExplanation: (index: number, explanation: string) => void
    readonly toggleCorrectAnswer: (index: number) => void
    readonly addAnswer: () => void
}

export const AnswersEdit = ({
    answers,
    explanations,
    correctAnswers,
    isMultipleChoice,
    setAnswer,
    setExplanation,
    toggleCorrectAnswer,
    addAnswer,
}: AnswersProps) => {
    return (
        <>
            <h3 className="answers-header">Enter your answers</h3>
            {answers.map((answer, index) => (
                <AnswerRow
                    answer={answer}
                    explanation={explanations[index] || ''}
                    isCorrect={correctAnswers.includes(index)}
                    index={index}
                    isMultipleChoice={isMultipleChoice}
                    setAnswer={setAnswer}
                    setExplanation={setExplanation}
                    toggleCorrectAnswer={toggleCorrectAnswer}
                />
            ))}
            <AddAnswerButton addAnswer={addAnswer} />
        </>
    )
}
