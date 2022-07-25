package ru.zivo.beatstore.service;

import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.io.IOException;
import java.util.List;

public interface PlaylistService {

    Playlist findById(Long id);

    PlaylistDto findDtoById(Long id);

    List<Playlist> findAllByUserId(Long id);

    Playlist create(Long userId, Playlist playlist);

    void update(Playlist playlist);

    void uploadImage(Long id, MultipartFile image) throws IOException;

    void addBeat(Long playlistId, Long beatId);

    void removeBeat(Long playlistId, Long beatId);

    void addFavorite(Long playlistId, Long userId);

    void removeFavorite(Long playlistId, Long userId);

    List<PlaylistDto> getRecommended(Integer limit);
}
