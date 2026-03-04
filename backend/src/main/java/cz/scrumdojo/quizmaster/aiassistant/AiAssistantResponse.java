package cz.scrumdojo.quizmaster.aiassistant;

public record AiAssistantResponse(String question, String[] answers, int[] correctAnswers) {}
