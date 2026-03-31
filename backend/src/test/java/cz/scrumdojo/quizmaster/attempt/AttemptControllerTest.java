package cz.scrumdojo.quizmaster.attempt;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import cz.scrumdojo.quizmaster.quiz.Quiz;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AttemptControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void createAndGetAttempt() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));

        var result = mockMvc.perform(post("/api/attempt")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "quizId": %d,
                        "durationSeconds": 120,
                        "points": 2.5,
                        "score": 83.33,
                        "status": "FINISHED",
                        "maxScore": 3,
                        "startedAt": "2026-01-01T10:00:00",
                        "finishedAt": "2026-01-01T10:02:00"
                    }
                    """.formatted(quiz.getId())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(content().json("""
                {
                    "quizId": %d,
                    "durationSeconds": 120,
                    "status": "FINISHED",
                    "maxScore": 3
                }
                """.formatted(quiz.getId())))
            .andReturn();

        Integer id = com.jayway.jsonpath.JsonPath
            .read(result.getResponse().getContentAsString(), "$.id");

        mockMvc.perform(get("/api/attempt/{id}", id))
            .andExpect(status().isOk())
            .andExpect(content().json("""
                {
                    "id": %d,
                    "quizId": %d,
                    "durationSeconds": 120,
                    "status": "FINISHED",
                    "maxScore": 3
                }
                """.formatted(id, quiz.getId())));
    }

    @Test
    public void getAttemptsByQuiz() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));

        fixtures.save(fixtures.attempt(quiz));
        fixtures.save(fixtures.attemptTimedOut(quiz));
        fixtures.save(fixtures.attemptInProgress(quiz));

        mockMvc.perform(get("/api/attempt/quiz/{quizId}", quiz.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    public void getAttemptsByQuizEmpty() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));

        mockMvc.perform(get("/api/attempt/quiz/{quizId}", quiz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().json("[]"));
    }

    @Test
    public void updateAttempt() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));
        Attempt attempt = fixtures.save(fixtures.attemptInProgress(quiz));

        mockMvc.perform(put("/api/attempt/{id}", attempt.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "quizId": %d,
                        "durationSeconds": 180,
                        "points": 3.0,
                        "score": 100.00,
                        "status": "FINISHED",
                        "maxScore": 3,
                        "startedAt": "2026-01-01T10:00:00",
                        "finishedAt": "2026-01-01T10:03:00"
                    }
                    """.formatted(quiz.getId())))
            .andExpect(status().isOk())
            .andExpect(content().json("""
                {
                    "id": %d,
                    "durationSeconds": 180,
                    "status": "FINISHED",
                    "maxScore": 3
                }
                """.formatted(attempt.getId())));
    }

    @Test
    public void deleteAttempt() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));
        Attempt attempt = fixtures.save(fixtures.attempt(quiz));

        mockMvc.perform(delete("/api/attempt/{id}", attempt.getId()))
            .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/attempt/{id}", attempt.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteAttemptNotFound() throws Exception {
        mockMvc.perform(delete("/api/attempt/{id}", -1))
            .andExpect(status().isNotFound());
    }

    @Test
    public void getAttemptNotFound() throws Exception {
        mockMvc.perform(get("/api/attempt/{id}", -1))
            .andExpect(status().isNotFound());
    }

    @Test
    public void createAttemptWithDifferentStatuses() throws Exception {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.save(fixtures.quiz(question));

        mockMvc.perform(post("/api/attempt")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "quizId": %d,
                        "durationSeconds": 100,
                        "points": 2.0,
                        "score": 100,
                        "status": "FINISHED",
                        "maxScore": 2,
                        "startedAt": "2026-01-01T10:00:00",
                        "finishedAt": "2026-01-01T10:01:40"
                    }
                    """.formatted(quiz.getId())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("FINISHED"));

        mockMvc.perform(post("/api/attempt")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "quizId": %d,
                        "durationSeconds": 300,
                        "points": 1.0,
                        "score": 50,
                        "status": "TIMEOUT",
                        "maxScore": 2,
                        "startedAt": "2026-01-01T10:00:00",
                        "finishedAt": "2026-01-01T10:05:00"
                    }
                    """.formatted(quiz.getId())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("TIMEOUT"));

        mockMvc.perform(post("/api/attempt")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "quizId": %d,
                        "durationSeconds": 0,
                        "points": 0,
                        "score": 0,
                        "status": "IN_PROGRESS",
                        "maxScore": 0,
                        "startedAt": "2026-01-01T10:00:00"
                    }
                    """.formatted(quiz.getId())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
