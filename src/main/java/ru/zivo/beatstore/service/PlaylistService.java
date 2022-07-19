package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.util.List;

public interface PlaylistService {

    Playlist findById(Long id);

    List<PlaylistDto> getRecommended(Integer limit);

    void addAndDeleteFavorite(Long playlistId, Long userId);
}
