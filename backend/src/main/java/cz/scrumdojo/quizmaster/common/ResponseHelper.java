package cz.scrumdojo.quizmaster.common;

import org.springframework.http.ResponseEntity;

import java.util.Optional;

public class ResponseHelper {

    public static <T> ResponseEntity<T> okOrNotFound(Optional<T> entity) {
        return entity
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
