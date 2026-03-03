package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;
    private final QuizRepository quizRepository;

    @Autowired
    public QuizController(QuizService quizService, QuizRepository quizRepository) {
        this.quizService = quizService;
        this.quizRepository = quizRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        return ResponseHelper.okOrNotFound(quizService.getQuiz(id));
    }

    @Transactional
    @PostMapping
    public ResponseEntity<QuizCreateResponse> createQuiz(@RequestBody QuizRequest request) {
        Quiz output = quizRepository.save(request.toEntity());
        return ResponseEntity.ok(new QuizCreateResponse(output.getId()));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<QuizCreateResponse> updateQuiz(@PathVariable Integer id, @RequestBody QuizRequest request) {
        Quiz quiz = request.toEntity();
        quiz.setId(id);
        Quiz output = quizRepository.save(quiz);
        return ResponseEntity.ok(new QuizCreateResponse(output.getId()));
    }
}
