import { Button, TextInput } from 'pages/components'
import type { AnswerState } from './question-form-state.ts'

interface AnswerRowProps {
    readonly state: AnswerState
    readonly isMultipleChoice: boolean
}

export const AnswerRow = ({ state, isMultipleChoice }: AnswerRowProps) => (
    <div key={`answer-${state.index}`} className="answer-row" id={`answer-${state.index}`}>
        <div className="answer-row-section">
            <input
                className={!isMultipleChoice ? 'answer-isCorrect-checkbox' : 'answer-isCorrect-checkbox-multi'}
                type="checkbox"
                checked={state.isCorrect}
                onChange={state.toggleCorrect}
            />
            <span className="answer-row-correct-icon">{state.isCorrect ? '✅' : '❌'}</span>
            <span className="answer-row-correct-text">{state.isCorrect ? 'Correct answer' : 'Incorrect answer'}</span>
        </div>
        <div className="answer-row-section">
            <TextInput className="text" value={state.answer} onChange={state.setAnswer} />
        </div>
        <div className="answer-row-section">
            <TextInput className="explanation" value={state.explanation} onChange={state.setExplanation} />
        </div>
    </div>
)

interface AnswersProps {
    readonly answerStates: readonly AnswerState[]
    readonly isMultipleChoice: boolean
    readonly addAnswer: () => void
}

export const AnswersEdit = ({ answerStates, isMultipleChoice, addAnswer }: AnswersProps) => {
    return (
        <>
            <h3 className="answers-header">Enter your answers</h3>
            {answerStates.map(state => (
                <AnswerRow state={state} isMultipleChoice={isMultipleChoice} />
            ))}
            <div>
                <Button onClick={addAnswer} className="secondary button" id="add-answer">
                    Add Answer
                </Button>
            </div>
        </>
    )
}
