package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Purchased;
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
    public ResponseEntity<User> findById(@PathVariable Long id)  {
        return ResponseEntity.ok(userService.findById(id));
    }

    @Operation(summary = "Удаление пользователя")
    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    @Operation(summary = "Купленные пользователя по его id")
    @GetMapping("/purchased/{id}")
    public ResponseEntity<Page<Purchased>> getPurchased(@PathVariable Long id, Pageable pageable)  {
        return ResponseEntity.ok(userService.getPurchasedBeats(id, pageable));
    }

    @Operation(summary = "Получение рекомендуемых пользователей")
    @GetMapping("/recommended")
    public ResponseEntity<List<User>> getRecommended(@RequestParam Integer limit) {
        return ResponseEntity.ok(userService.getRecommended(limit));
    }

    @Operation(summary = "Пользователь по username с дополнительными данными для отображения на странице профиля")
    @GetMapping("username/{username}/authUser/{authUserId}")
    public ResponseEntity<DisplayUserDto> getDisplayUserDto(@PathVariable String username,
                                                            @PathVariable(required = false) Long authUserId)  {
        return ResponseEntity.ok(userService.getDisplayUserDto(username, authUserId));
    }
}
