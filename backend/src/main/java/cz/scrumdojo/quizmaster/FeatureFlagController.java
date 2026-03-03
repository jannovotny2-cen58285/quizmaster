package cz.scrumdojo.quizmaster;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FeatureFlagController {

    @GetMapping("/feature-flag")
    public boolean isFeatureEnabled() {
        return FeatureFlag.isEnabled();
    }
}
