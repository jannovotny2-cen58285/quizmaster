package cz.scrumdojo.quizmaster.quiz;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "quiz_stats")
public class QuizStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private Integer timesTaken = 0;

    @Column(nullable = false)
    private Integer timesFinished = 0;

    @Column(nullable = false)
    private Double averageScore = 0.0;

    @Column(nullable = false)
    private Integer timeoutCount = 0;

    @Column(nullable = false)
    private Double failureRate = 0.0;

    @Column(nullable = false)
    private Double successRate = 0.0;

    @Column(nullable = false)
    private Double averageTime = 0.0;
}
