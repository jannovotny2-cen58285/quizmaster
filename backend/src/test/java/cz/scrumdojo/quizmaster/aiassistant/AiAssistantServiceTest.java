package cz.scrumdojo.quizmaster.aiassistant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

public class AiAssistantServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String apiToken = System.getenv("AI_TOKEN");

    private AiAssistantService createService(String token) {
        return new AiAssistantService(objectMapper, token);
    }

    @Test
    void generateQuestionReturnsValidResponse() {
        assumeTrue(apiToken != null && !apiToken.isBlank(), "AI_TOKEN env var not set");

        var response = createService(apiToken).generateQuestion("capital cities of Europe");

        assertNotNull(response.question());
        assertFalse(response.question().isBlank());
        assertNotNull(response.answers());
        assertEquals(2, response.answers().length);
        assertNotNull(response.correctAnswers());
        assertEquals(1, response.correctAnswers().length);
        assertEquals(0, response.correctAnswers()[0]);
    }

    @Test
    void generateQuestionFailsOnEmptyPrompt() {
        assertThrows(ResponseStatusException.class, () -> createService("token").generateQuestion("   "));
    }

    @Test
    void generateQuestionFailsWhenTokenMissing() {
        assertThrows(ResponseStatusException.class, () -> createService("").generateQuestion("topic"));
    }
}
