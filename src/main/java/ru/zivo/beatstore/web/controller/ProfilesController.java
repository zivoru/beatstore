package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.ProfileService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.ProfileDto;
import ru.zivo.beatstore.web.mapper.ProfileMapper;

import java.io.IOException;

@Tag(name = "ProfileController", description = "API для работы с профилями")
@RequestMapping("api/v1/profiles")
@RestController
public class ProfilesController {

    private final UserService userService;
    private final ProfileService profileService;
    private final ProfileMapper mapper;

    @Autowired
    public ProfilesController(UserService userService, ProfileService profileService, ProfileMapper mapper) {
        this.userService = userService;
        this.profileService = profileService;
        this.mapper = mapper;
    }

    @Operation(summary = "Получение профиля по id пользователя")
    @GetMapping("{userId}")
    public ResponseEntity<Profile> getProfileByIdUser(@PathVariable String userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(user.getProfile());
    }

    @Operation(summary = "Изменение профиля")
    @PutMapping
    public ResponseEntity<Long> updateProfile(@AuthenticationPrincipal OAuth2User principal,
                                              @RequestBody ProfileDto profileDto) {
        if (principal != null) {
            Profile updatedProfile = profileService.updateProfile(principal.getAttribute("sub"), mapper.toEntity(profileDto));
            return ResponseEntity.ok(updatedProfile.getId());
        }
        return null;
    }

    @Operation(summary = "Добавление и изменение фото профиля")
    @PostMapping("image/{profileId}")
    public void updateImage(@PathVariable Long profileId,
                            @RequestParam(name = "file") MultipartFile photo) throws IOException {
        profileService.updateImage(profileId, photo);
    }
}
