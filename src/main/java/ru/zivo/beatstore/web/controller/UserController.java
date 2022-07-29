package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.util.List;

@Tag(name = "UserController", description = "API для работы с пользователями")
@RequestMapping("api/v1/users")
@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Пользователь по id")
    @GetMapping("{id}")
    public ResponseEntity<User> findById(@PathVariable String id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @Operation(summary = "Удаление пользователя")
    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable String id) {
        userService.delete(id);
    }

    @Operation(summary = "Получение рекомендуемых пользователей")
    @GetMapping("/recommended")
    public ResponseEntity<List<User>> getRecommended(@RequestParam Integer limit) {
        return ResponseEntity.ok(userService.getRecommended(limit));
    }

    @Operation(summary = "Пользователь по username с дополнительными данными для отображения на странице профиля")
    @GetMapping("username/{username}")
    public ResponseEntity<DisplayUserDto> getDisplayUserDto(@PathVariable String username,
                                                            @AuthenticationPrincipal OAuth2User principal) {
        String authUserId = principal == null ? null : principal.getAttribute("sub");
        return ResponseEntity.ok(userService.getDisplayUserDto(username, authUserId));
    }

    @Operation(summary = "Подписка и отписка")
    @PostMapping("/subscribe/channel/{channelId}")
    public boolean subscribeAndUnsubscribe(@AuthenticationPrincipal OAuth2User principal,
                                           @PathVariable String channelId) {
        String userId = principal == null ? null : principal.getAttribute("sub");
        return userService.subscribeAndUnsubscribe(userId, channelId);
    }
}
