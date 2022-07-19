package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.util.List;

@Tag(name = "PlaylistController", description = "API для работы с плейлистами")
@RequestMapping("api/v1/playlists")
@RestController
public class PlaylistController {

    private final PlaylistService playlistService;

    @Autowired
    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @Operation(summary = "Получение рекомендуемых плейлистов")
    @GetMapping("/recommended")
    public ResponseEntity<List<PlaylistDto>> getRecommended(@RequestParam Integer limit) {
        return ResponseEntity.ok(playlistService.getRecommended(limit));
    }

    @Operation(summary = "Добавление и удаление из избранного")
    @PostMapping("favorite/{playlistId}/{userId}")
    public void addAndDeleteFavorite(@PathVariable Long playlistId, @PathVariable Long userId) {
        playlistService.addAndDeleteFavorite(playlistId, userId);
    }
}
