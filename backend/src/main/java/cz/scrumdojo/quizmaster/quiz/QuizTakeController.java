package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.ResponseHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizTakeController {

    private final QuizService quizService;

    public QuizTakeController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        return ResponseHelper.okOrNotFound(quizService.getQuiz(id));
    }
}
