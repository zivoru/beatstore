package ru.zivo.beatstore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.UserRepository;

import java.util.Collections;
import java.util.Map;

@SpringBootApplication
@RestController
public class BeatstoreApplication {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {

        String id = principal.getAttribute("sub");

        assert id != null;
        User user = userRepository.findById(id).orElseGet(() -> User.builder()
                .id(id)
                .username(principal.getAttribute("name"))
                .email(principal.getAttribute("email"))
                .verified(false)
                .status(Status.ACTIVE)
                .build());

        userRepository.save(user);

        return Collections.singletonMap("name", user.getUsername());
    }

    public static void main(String[] args) {
        SpringApplication.run(BeatstoreApplication.class, args);
    }

}
