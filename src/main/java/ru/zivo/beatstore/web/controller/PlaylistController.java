package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.web.dto.PlaylistDto;
import ru.zivo.beatstore.web.mapper.PlaylistMapper;

import java.io.IOException;
import java.util.List;

@Tag(name = "PlaylistController", description = "API для работы с плейлистами")
@RequestMapping("api/v1/playlists")
@RestController
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;
    private final PlaylistMapper mapper;

    @Operation(summary = "Получение дто плейлиста по id")
    @GetMapping("{id}")
    public ResponseEntity<PlaylistDto> findById(@AuthenticationPrincipal OAuth2User principal,
                                                @PathVariable Long id) {
        String userId = principal == null ? null : principal.getAttribute("sub");
        return ResponseEntity.ok(playlistService.findDtoById(id, userId));
    }

    @Operation(summary = "Получение списка плейлистов по id пользователя")
    @GetMapping
    public ResponseEntity<List<Playlist>> findAllByUserId(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null
                : ResponseEntity.ok(playlistService.findAllByUserId(principal.getAttribute("sub")));
    }

    @Operation(summary = "Получение страницы дто плейлистов по id пользователя")
    @GetMapping("user/{userId}")
    public ResponseEntity<Page<PlaylistDto>> findAllByUserId(@PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(playlistService.findPageByUserId(userId, pageable));
    }

    @Operation(summary = "Создание плейлиста")
    @PostMapping
    public ResponseEntity<Long> create(@AuthenticationPrincipal OAuth2User principal, @RequestBody PlaylistDto playlistDto) {
        if (principal == null) {
            return null;
        }
        Playlist playlist = playlistService.create(principal.getAttribute("sub"), mapper.toEntity(playlistDto));
        return ResponseEntity.ok(playlist.getId());
    }

    @Operation(summary = "Изменение плейлиста")
    @PutMapping("{id}")
    public void update(@AuthenticationPrincipal OAuth2User principal,
                       @PathVariable Long id,
                       @RequestBody PlaylistDto playlistDto) {
        if (principal != null) {
            playlistService.update(principal.getAttribute("sub"), id, mapper.toEntity(playlistDto));
        }
    }

    @Operation(summary = "Удаление плейлиста")
    @DeleteMapping("{id}")
    public void update(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long id) {
        if (principal != null) {
            playlistService.delete(principal.getAttribute("sub"), id);
        }
    }

    @Operation(summary = "Загрузка фото плейлиста")
    @PostMapping("uploadImage/{id}")
    public void uploadImage(@PathVariable Long id,
                            @RequestParam(name = "image") MultipartFile image) throws IOException {
        playlistService.uploadImage(id, image);
    }

    @Operation(summary = "Добавление бита в плейлист")
    @PostMapping("addBeat/{playlistId}/{beatId}")
    public void addBeat(@AuthenticationPrincipal OAuth2User principal,
                        @PathVariable Long playlistId,
                        @PathVariable Long beatId) {
        if (principal != null) {
            playlistService.addBeat(principal.getAttribute("sub"), playlistId, beatId);
        }
    }

    @Operation(summary = "Удаление бита из плейлиста")
    @PostMapping("removeBeat/{playlistId}/{beatId}")
    public void removeBeat(@AuthenticationPrincipal OAuth2User principal,
                           @PathVariable Long playlistId,
                           @PathVariable Long beatId) {
        if (principal != null) {
            playlistService.removeBeat(principal.getAttribute("sub"), playlistId, beatId);
        }
    }

    @Operation(summary = "Добавление в избранное")
    @PostMapping("addFavorite/{playlistId}")
    public void addFavorite(@PathVariable Long playlistId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            playlistService.addFavorite(playlistId, principal.getAttribute("sub"));
        }
    }

    @Operation(summary = "Удаление из избранного")
    @PostMapping("removeFavorite/{playlistId}")
    public void removeFavorite(@PathVariable Long playlistId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            playlistService.removeFavorite(playlistId, principal.getAttribute("sub"));
        }
    }

    @Operation(summary = "Получение страницы плейлистов")
    @GetMapping("findAll")
    public ResponseEntity<Page<PlaylistDto>> findAll(@RequestParam(required = false) String nameFilter,
                                                     Pageable pageable) {
        return ResponseEntity.ok(playlistService.findAll(pageable, nameFilter));
    }
}
