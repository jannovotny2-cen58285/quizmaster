package cz.scrumdojo.quizmaster.attempt;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AttemptRequest(
        Integer quizId,
        Integer durationSeconds,
        BigDecimal points,
        BigDecimal score,
        AttemptStatus status,
        Integer maxScore,
        LocalDateTime startedAt,
        LocalDateTime finishedAt
) {
    public Attempt toEntity() {
        return Attempt.builder()
                .quizId(quizId)
                .durationSeconds(durationSeconds)
                .points(points)
                .score(score)
                .status(status)
                .maxScore(maxScore)
                .startedAt(startedAt)
                .finishedAt(finishedAt)
                .build();
    }
}

