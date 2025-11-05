package cz.scrumdojo.quizmaster.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizStatsRepository extends JpaRepository<QuizStats, Integer> {
    QuizStats findByQuizId(Integer quizId);
}
