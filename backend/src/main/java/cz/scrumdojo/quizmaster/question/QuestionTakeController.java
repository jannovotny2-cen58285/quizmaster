package cz.scrumdojo.quizmaster.question;

import cz.scrumdojo.quizmaster.common.ResponseHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question")
public class QuestionTakeController {

    private final QuestionRepository questionRepository;

    public QuestionTakeController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Integer id) {
        return ResponseHelper.okOrNotFound(questionRepository.findById(id).map(QuestionResponse::from));
    }
}
