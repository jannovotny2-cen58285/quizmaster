package cz.scrumdojo.quizmaster.aiassistant;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AiAssistantQuestionType {

    SINGLE("single"),
    MULTIPLE("multiple");

    @JsonValue
    private final String value;
}
