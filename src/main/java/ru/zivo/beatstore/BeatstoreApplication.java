package ru.zivo.beatstore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.UserService;

import java.util.Collections;
import java.util.Map;

@SpringBootApplication
@RestController
public class BeatstoreApplication {

    private final UserRepository userRepository;

    private final UserService userService;

    @Autowired
    public BeatstoreApplication(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            String id = principal.getAttribute("sub");

            assert id != null;
            User user = userRepository.findById(id).orElseGet(() ->
                    userService.register(id, principal.getAttribute("name"), principal.getAttribute("email")));

            return Collections.singletonMap("user", user);
        }
        return null;
    }

    public static void main(String[] args) {
        SpringApplication.run(BeatstoreApplication.class, args);
    }

}
