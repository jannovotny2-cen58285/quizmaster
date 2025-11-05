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

        assertEquals(0, quizResponse.getTimesTaken());
        assertEquals(0, quizResponse.getTimesFinished());
        assertEquals(0.0, quizResponse.getAverageScore());
        assertEquals(0, quizResponse.getTimeoutCount());
        assertEquals(0.0, quizResponse.getFailureRate());
        assertEquals(0.0, quizResponse.getSuccessRate());
        assertEquals(0.0, quizResponse.getAverageTime());
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

        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(80));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(90));
        quizController.updateQuizFinishedCounts(quizId, new ScoreRequest(100));

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);

        assertEquals(3, quizResponse.getTimesFinished(), "timesFinished should be 3");
        assertEquals(90.0, quizResponse.getAverageScore(), 0.001, "averageScore should be recalculated correctly");
    }
}