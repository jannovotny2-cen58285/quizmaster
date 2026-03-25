CREATE TABLE attempt (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    points NUMERIC(10, 2) NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    max_score INTEGER NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('FINISHED', 'IN_PROGRESS', 'TIMEOUT'))
);

CREATE INDEX idx_attempt_quiz_id ON attempt(quiz_id);

