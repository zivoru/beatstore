package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.service.SocialService;
import ru.zivo.beatstore.web.dto.SocialDto;
import ru.zivo.beatstore.web.mapper.SocialMapper;

@Tag(name = "SocialController", description = "API для работы с социальными сетями")
@RequestMapping("api/v1/socials")
@RestController
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;
    private final SocialMapper mapper;

    @PutMapping
    public void update(@AuthenticationPrincipal OAuth2User principal, @RequestBody SocialDto socialDto) {
        if (principal != null) {
            socialService.update(principal.getAttribute("sub"), mapper.toEntity(socialDto));
        }
    }
}
