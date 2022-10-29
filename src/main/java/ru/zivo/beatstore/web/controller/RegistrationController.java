package ru.zivo.beatstore.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.UserService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;

    @GetMapping("/user")
    public Map<String, User> user(@AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            String id = principal.getAttribute("sub");

            assert id != null;

            User user;
            try {
                user = userService.findById(id);
            } catch (NotFoundException exception) {
                user = userService.register(id, principal.getAttribute("name"),
                        principal.getAttribute("email"));
            }

            return Map.of("user", user);
        }

        return Map.of();
    }
}