ALTER TABLE quiz ADD COLUMN random_question_count INTEGER NULL;
UPDATE quiz SET random_question_count = COALESCE(final_count, size);
ALTER TABLE quiz DROP COLUMN size;
ALTER TABLE quiz DROP COLUMN final_count;
