package cz.scrumdojo.quizmaster.quiz;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ScoreRequest {
    private double score;
    private boolean passed;
    private boolean timeout;
    private double timeTaken;
}