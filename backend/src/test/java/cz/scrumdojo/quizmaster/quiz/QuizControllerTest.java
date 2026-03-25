package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.TestcontainersConfiguration;
import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void createAndGetQuiz() {
        Question question = fixtures.save(fixtures.question());
        QuizRequest request = fixtures.quizRequest(question);

        QuizCreateResponse createResponse = quizController.createQuiz(request).getBody();
        assertNotNull(createResponse, "Create response should not be null");
        Integer quizId = createResponse.id();
        assertNotNull(quizId, "Quiz ID should not be null after creation");

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);

        assertEquals(quizId, quizResponse.getId());
        assertEquals(request.title(), quizResponse.getTitle());
        assertEquals(request.description(), quizResponse.getDescription());
        assertEquals(request.mode(), quizResponse.getMode());
        assertEquals(request.passScore(), quizResponse.getPassScore());
        assertEquals(request.timeLimit(), quizResponse.getTimeLimit());
        assertEquals(request.randomQuestionCount(), quizResponse.getRandomQuestionCount());
        assertEquals(1, quizResponse.getQuestions().length);
        assertEquals(question.getId(), quizResponse.getQuestions()[0].getId());
    }

}
