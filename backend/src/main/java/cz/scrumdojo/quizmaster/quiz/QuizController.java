package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.Question;
import cz.scrumdojo.quizmaster.question.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import cz.scrumdojo.quizmaster.QuizUtils;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final QuizStatsRepository quizStatsRepository;

    @Autowired
    public QuizController(QuestionRepository questionRepository,
                          QuizRepository quizRepository,
                          QuizStatsRepository quizStatsRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
        this.quizStatsRepository = quizStatsRepository;
    }

    @Transactional
    @GetMapping("/quiz/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        QuizStats stats = quizStatsRepository.findByQuizId(id);
        if (stats == null) {
            stats = new QuizStats();
            stats.setQuiz(quiz);
            quizStatsRepository.save(stats);
        }

        int questionsLimit = (quiz.getSize() != null && quiz.getSize() > 0)
                ? quiz.getSize()
                : quiz.getQuestionIds().length;

        Question[] questions = new Question[questionsLimit];
        for (int i = 0; i < questionsLimit; i++) {
            questions[i] = questionRepository.getReferenceById(quiz.getQuestionIds()[i]);
        }

        if(quiz.getFinalCount() != null && quiz.getFinalCount() > 0 && questions.length > 0){
            questions = QuizUtils.shuffleQuestions(questions);
            questions = QuizUtils.shrinkQuestions(questions, quiz.getFinalCount());
        }

       QuizResponse build = QuizResponse.builder()
        .id(quiz.getId())
        .title(quiz.getTitle())
        .description(quiz.getDescription())
        .questions(questions)
        .mode(quiz.getMode())
        .passScore(quiz.getPassScore())
        .timeLimit(quiz.getTimeLimit())
        .timesTaken(stats.getTimesTaken())
        .timesFinished(stats.getTimesFinished())
        .averageScore(stats.getAverageScore())
        .timeoutCount(stats.getTimeoutCount())
        .failureRate(stats.getFailureRate())
        .successRate(stats.getSuccessRate())
        .averageTime(stats.getAverageTime())
        .size(quiz.getSize())
        .build();

        return ResponseEntity.ok(build);
    }

    @Transactional
    @PostMapping("/quiz")
    public ResponseEntity<Integer> createQuiz(@RequestBody Quiz quizInput) {
        Quiz output = quizRepository.save(quizInput);
        QuizStats stats = new QuizStats();
        stats.setQuiz(output);
        quizStatsRepository.save(stats);
        return ResponseEntity.ok(output.getId());
    }

    @Transactional
    @PutMapping("/quiz/{id}/start")
    public ResponseEntity<Void> updateQuizCounts(@PathVariable Integer id) {
        QuizStats stats = quizStatsRepository.findByQuizId(id);
        if (stats == null) {
            return ResponseEntity.notFound().build();
        }

        stats.setTimesTaken(stats.getTimesTaken() + 1);
        quizStatsRepository.save(stats);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("/quiz/{id}/evaluate")
    public ResponseEntity<Void> updateQuizFinishedCounts(@PathVariable Integer id, @RequestBody ScoreRequest payload) {
        int score = payload.getScore();

        QuizStats stats = quizStatsRepository.findByQuizId(id);
        if (stats == null) {
            return ResponseEntity.notFound().build();
        }

        stats.setTimesFinished(stats.getTimesFinished() + 1);
        stats.setAverageScore(stats.getAverageScore() + (score - stats.getAverageScore()) / stats.getTimesFinished());
        quizStatsRepository.save(stats);

        return ResponseEntity.ok().build();
    }
}
