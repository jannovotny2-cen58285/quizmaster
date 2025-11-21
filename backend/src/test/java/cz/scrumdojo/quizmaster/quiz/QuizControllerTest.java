package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private QuizStatsRepository quizStatsRepository;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void createAndGetQuiz() {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.quiz(question,question).build();

        Integer quizId = quizController.createQuiz(quiz).getBody();
        assertNotNull(quizId, "Quiz ID should not be null after creation");

        QuizStats stats = quizStatsRepository.findByQuizId(quizId);
        assertNotNull(stats, "QuizStats should be automatically created with Quiz");
        assertEquals(0, stats.getTimesTaken());
        assertEquals(0, stats.getTimesFinished());
        assertEquals(0.0, stats.getAverageScore());

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);

        assertEquals(quizId, quizResponse.getId());
        assertEquals(quiz.getTitle(), quizResponse.getTitle());
        assertEquals(quiz.getDescription(), quizResponse.getDescription());
        assertEquals(quiz.getMode(), quizResponse.getMode());
        assertEquals(quiz.getPassScore(), quizResponse.getPassScore());
        assertEquals(quiz.getTimeLimit(), quizResponse.getTimeLimit());
        assertEquals(quiz.getSize(), quizResponse.getSize());
        assertEquals(1, quizResponse.getQuestions().length);
        assertEquals(question.getId(), quizResponse.getQuestions()[0].getId());
    }

    @Test
    public void updateQuizCountsOnly() {
        Integer quizId = quizController.createQuiz(fixtures.quiz().build()).getBody();

        assertEquals(HttpStatus.OK, quizController.updateQuizCounts(quizId).getStatusCode());

        QuizStats stats = quizStatsRepository.findByQuizId(quizId);
        assertNotNull(stats, "QuizStats should exist after quiz is created");
        assertEquals(1, stats.getTimesTaken(), "timesTaken should increment by 1");
    }

    @Test
    public void updateQuizFinishedCountsOnly() {
        Integer quizId = quizController.createQuiz(fixtures.quiz().build()).getBody();

        // simulujeme 3 dokončené pokusy
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(80.0, true, false, 0.0));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(90.0, true, false, 0.0));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(100.0, true, false, 0.0));

        QuizStats stats = quizStatsRepository.findByQuizId(quizId);
        assertNotNull(stats);

        // mělo by se správně načítat timesFinished
        assertEquals(3, stats.getTimesFinished(), "timesFinished should be 3");

        // průměr skóre by měl být v rozmezí 0–100 %
        assertTrue(
            stats.getAverageScore() >= 0.0 && stats.getAverageScore() <= 100.0,
            "averageScore should be between 0 and 100"
        );

        // kontrola, že success/failure se správně drží v intervalu
        assertTrue(stats.getSuccessRate() >= 0.0 && stats.getSuccessRate() <= 100.0,
            "successRate should be between 0 and 100");
        assertTrue(stats.getFailureRate() >= 0.0 && stats.getFailureRate() <= 100.0,
            "failureRate should be between 0 and 100");
    }

    @Test
    public void getQuizStats() {
        Integer quizId = quizController.createQuiz(fixtures.quiz().build()).getBody();

        QuizStats stats = quizController.getQuizStats(quizId).getBody();
        assertNotNull(stats, "QuizStats should be returned");
        assertEquals(0, stats.getTimesTaken());
        assertEquals(0, stats.getTimesFinished());
        assertEquals(0.0, stats.getAverageScore());
        assertEquals(0, stats.getTimeoutCount());
        assertEquals(0.0, stats.getSuccessRate());
        assertEquals(0.0, stats.getFailureRate());
        assertEquals(0.0, stats.getAverageTime());
    }

    @Test
    public void getQuizStatsNotFound() {
        assertEquals(HttpStatus.NOT_FOUND, quizController.getQuizStats(999999).getStatusCode());
    }

    @Test
    public void getQuizStatsAutoCreatesIfMissing() {
        Integer quizId = quizController.createQuiz(fixtures.quiz().build()).getBody();

        // Manually delete stats to simulate missing stats
        QuizStats existingStats = quizStatsRepository.findByQuizId(quizId);
        if (existingStats != null) {
            quizStatsRepository.delete(existingStats);
        }

        // Should auto-create stats when fetching
        QuizStats stats = quizController.getQuizStats(quizId).getBody();
        assertNotNull(stats, "QuizStats should be auto-created");
        assertEquals(0, stats.getTimesTaken());
    }
}