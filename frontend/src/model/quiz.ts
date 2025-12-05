import type { Question } from './question.ts'

export type QuizMode = 'LEARN' | 'EXAM'
export type Difficulty = 'EASY' | 'HARD' | 'KEEP_QUESTION'

export interface Quiz {
    readonly id: number
    readonly title: string
    readonly description: string
    readonly questions: readonly Question[]
    readonly mode: QuizMode
    readonly difficulty?: Difficulty
    readonly passScore: number
    readonly timeLimit: number
    readonly size?: number
}
