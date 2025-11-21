import { useParams } from 'react-router-dom'
import { useState } from 'react'
import type { Quiz, QuizStats } from 'model/quiz.ts'
import { fetchQuiz, fetchQuizStats } from 'api/quiz'
import { useApi } from 'api/hooks'

export const QuizStatisticsPage = () => {
    const params = useParams()

    const quizId = params.id

    const [quizData, setQuizData] = useState<Quiz | null>(null)
    const [statsData, setStatsData] = useState<QuizStats | null>(null)

    useApi(quizId, fetchQuiz, setQuizData)
    useApi(quizId, fetchQuizStats, setStatsData)

    return (
        quizData &&
        statsData && (
            <>
                <h2>Quiz statistics</h2>
                for quiz: <h3 id="quiz-name">{quizData.title}</h3>
                <p id="quiz-description">{quizData.description}</p>
                <div>
                    <p>
                        Times taken: <span id="times-taken">{statsData.timesTaken}</span>
                    </p>
                    <p>
                        Times finished: <span id="times-finished">{statsData.timesFinished}</span>
                    </p>
                    <p>
                        Average score: <span id="average-score">{statsData.averageScore} %</span>
                    </p>
                    <p>
                        Timeout count: <span id="timeout-count">{statsData.timeoutCount}</span>
                    </p>
                    <p>
                        Success rate: <span id="success-rate">{statsData.successRate}%</span>
                    </p>
                    <p>
                        Failure rate: <span id="failure-rate">{statsData.failureRate}%</span>
                    </p>
                    <p>
                        Average time: <span id="average-time">{statsData.averageTime} s</span>
                    </p>
                </div>
            </>
        )
    )
}
