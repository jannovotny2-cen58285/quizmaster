import type { Stats, StatsRecord, AttemptRequest } from 'model/stats.ts'
import { AttemptStatus } from 'model/stats.ts'
import { getJson, postJson, putJson } from './helpers.ts'

export const fetchStats = async (quizId: string): Promise<Stats> => {
    return await getJson<Stats>(`/api/attempt/quiz/${quizId}`)
}

export const createAttempt = async (request: AttemptRequest): Promise<StatsRecord> => {
    return await postJson<AttemptRequest, StatsRecord>('/api/attempt', request)
}

export const updateAttempt = async (id: number, request: AttemptRequest): Promise<StatsRecord> => {
    return await putJson<AttemptRequest, StatsRecord>(`/api/attempt/${id}`, request)
}

// Backward compatibility - deprecated
export const putStats = async (quizId: string, id: number, stats: Partial<StatsRecord>) => {
    const quizStats = await fetchStats(quizId)
    const currentStat = quizStats.find(s => s.id === id)

    if (!currentStat) {
        // Create new attempt
        const newAttempt: AttemptRequest = {
            quizId: Number.parseInt(quizId),
            durationSeconds: 0,
            points: 0,
            score: stats.score ?? 0,
            status: stats.status ?? AttemptStatus.IN_PROGRESS,
            maxScore: stats.maxScore ?? 0,
            startedAt: stats.startedAt ?? new Date().toISOString(),
            finishedAt: stats.finishedAt ?? null,
        }
        await createAttempt(newAttempt)
    } else {
        // Update existing attempt
        const updatedAttempt: AttemptRequest = {
            ...currentStat,
            ...stats,
        }
        await updateAttempt(id, updatedAttempt)
    }
}
