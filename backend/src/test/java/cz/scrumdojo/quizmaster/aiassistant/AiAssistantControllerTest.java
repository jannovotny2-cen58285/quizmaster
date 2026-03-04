package cz.scrumdojo.quizmaster.aiassistant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assumptions.assumeTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AiAssistantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void generateReturnsQuestionShape() throws Exception {
        assumeTrue(
            System.getenv("AI_TOKEN") != null && !System.getenv("AI_TOKEN").isBlank(),
            "AI_TOKEN env var not set"
        );

        mockMvc.perform(post("/api/ai-assistant")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"question": "capital cities of Europe"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.question").isNotEmpty())
            .andExpect(jsonPath("$.answers").isArray())
            .andExpect(jsonPath("$.answers.length()").value(2))
            .andExpect(jsonPath("$.correctAnswers").isArray())
            .andExpect(jsonPath("$.correctAnswers[0]").value(0));
    }

    @Test
    public void emptyInputReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/ai-assistant")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"question": "   "}
                    """))
            .andExpect(status().isBadRequest());
    }
}
