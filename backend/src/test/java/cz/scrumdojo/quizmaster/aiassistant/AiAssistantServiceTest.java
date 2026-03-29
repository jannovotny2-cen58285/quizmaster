package cz.scrumdojo.quizmaster.aiassistant;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@SpringBootTest
public class AiAssistantServiceTest {

    @Autowired
    private AiAssistantService aiAssistantService;

    @Value("${ai.token:}")
    private String apiToken;

    @Tag("ai")
    @Test
    void generateSingleChoiceQuestion() {
        assumeTrue(!apiToken.isBlank(), "ai.token not configured");

        var response = aiAssistantService.generateQuestion(
            AiAssistantQuestionType.SINGLE,
            "Generate a question about capital cities of Europe with 1 correct answer and 3 incorrect answers"
        );

        assertNotNull(response.question());
        assertFalse(response.question().isBlank());
        assertEquals(AiAssistantQuestionType.SINGLE, response.type());
        assertEquals(4, response.answers().length);
        assertEquals(1, response.correctAnswers().length);
    }

    @Tag("ai")
    @Test
    void generateMultipleChoiceQuestion() {
        assumeTrue(!apiToken.isBlank(), "ai.token not configured");

        var response = aiAssistantService.generateQuestion(
            AiAssistantQuestionType.MULTIPLE,
            "Generate a question about European capitals with 2 correct answers and 2 incorrect answers"
        );

        assertNotNull(response.question());
        assertFalse(response.question().isBlank());
        assertEquals(AiAssistantQuestionType.MULTIPLE, response.type());
        assertEquals(4, response.answers().length);
        assertEquals(2, response.correctAnswers().length);
    }

    @Test
    void generateQuestionFailsOnEmptyPrompt() {
        assertThrows(ResponseStatusException.class, () -> aiAssistantService.generateQuestion(AiAssistantQuestionType.SINGLE, "   "));
    }

    @Test
    void cleanAiResponseTest() {
        String cleaned = aiAssistantService.cleanAiResponse("""
                ```json
                {
                    "question": "Which dog breed is typically recognized as the tallest?",
                    "answers": ["Great Dane", "German Shepherd", "Golden Retriever", "Labrador Retriever"],
                    "correctAnswers": [0]
                }
                ```
                """);

        assertEquals("""
                {
                    "question": "Which dog breed is typically recognized as the tallest?",
                    "answers": ["Great Dane", "German Shepherd", "Golden Retriever", "Labrador Retriever"],
                    "correctAnswers": [0]
                }""", cleaned);
    }

    @Test
    void cleanAiResponseTest_wrongInput() {
        assertThrows(ResponseStatusException.class, () -> {
            aiAssistantService.cleanAiResponse("I'm Sorry Dave, I'm Afraid I Can't Do That");
        });
    }

    @Test
    void cleanAiResponseTest_empty() {
        assertThrows(ResponseStatusException.class, () -> {
            aiAssistantService.cleanAiResponse("");
        });
    }

    @Test
    void cleanAiResponseTest_null() {
        assertThrows(ResponseStatusException.class, () -> {
            aiAssistantService.cleanAiResponse(null);
        });
    }
}
