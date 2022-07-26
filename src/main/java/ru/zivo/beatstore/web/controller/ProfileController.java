package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.ProfileService;
import ru.zivo.beatstore.service.UserService;

import java.io.IOException;

@Tag(name = "ProfileController", description = "API для работы с профилями")
@RequestMapping("api/v1/profiles")
@RestController
public class ProfileController {

    private final UserService userService;
    private final ProfileService profileService;

    @Autowired
    public ProfileController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @Operation(summary = "Получение профиля по id пользователя")
    @GetMapping("{userId}")
    public ResponseEntity<Profile> getProfileByIdUser(@PathVariable String userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(user.getProfile());
    }

    @Operation(summary = "Изменение профиля")
    @PutMapping("{userId}")
    public ResponseEntity<Long> updateProfile(@PathVariable String userId, @RequestBody Profile profile) {
        Profile updatedProfile = profileService.updateProfile(userId, profile);
        return ResponseEntity.ok(updatedProfile.getId());
    }

    @Operation(summary = "Добавление и изменение фото профиля")
    @PostMapping("image/{profileId}")
    public void updateImage(@PathVariable Long profileId, @RequestParam(name = "file") MultipartFile photo) throws IOException {
        profileService.updateImage(profileId, photo);
    }
}
