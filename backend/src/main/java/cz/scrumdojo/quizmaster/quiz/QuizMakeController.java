package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.workspace.WorkspaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workspaces/{guid}/quizzes")
public class QuizMakeController {

    private final WorkspaceRepository workspaceRepository;
    private final QuizRepository quizRepository;

    public QuizMakeController(WorkspaceRepository workspaceRepository, QuizRepository quizRepository) {
        this.workspaceRepository = workspaceRepository;
        this.quizRepository = quizRepository;
    }

    @PostMapping
    public ResponseEntity<QuizWriteResponse> createQuiz(
            @PathVariable String guid, @RequestBody QuizRequest request) {
        if (!workspaceRepository.existsById(guid))
            return ResponseEntity.notFound().build();

        Quiz output = quizRepository.save(request.toEntity());
        return ResponseEntity.ok(new QuizWriteResponse(output.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizWriteResponse> updateQuiz(
            @PathVariable String guid, @PathVariable Integer id, @RequestBody QuizRequest request) {
        if (!workspaceRepository.existsById(guid))
            return ResponseEntity.notFound().build();

        Quiz quiz = request.toEntity();
        quiz.setId(id);
        Quiz output = quizRepository.save(quiz);
        return ResponseEntity.ok(new QuizWriteResponse(output.getId()));
    }
}
