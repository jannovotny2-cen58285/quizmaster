package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.QuestionResponse;

public record QuizResponse(
    Integer id,
    String title,
    QuestionResponse[] questions,
    QuizMode mode,
    Difficulty difficulty,
    int passScore,
    String description,
    Integer timeLimit,
    Integer randomQuestionCount
) {}
