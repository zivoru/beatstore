package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.model.filters.Filters;
import ru.zivo.beatstore.web.dto.DisplayBeatDto;

import java.io.IOException;
import java.util.List;

public interface BeatService {

    Beat findById(Long id);

    DisplayBeatDto findDtoById(String userId, Long id);

    Beat create(String userId, Beat beat);

    void update(String userId, Long beatId, Beat beat);

    void delete(String userId, Long beatId);

    void uploadImage(Long beatId, MultipartFile image) throws IOException;

    void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException;

    void addTags(Long beatId, List<Tag> tags);

    void addLicense(Long beatId, License license);

    void addPlay(Long id);

    void addToFavorite(Long beatId, String userId);

    void removeFromFavorite(Long beatId, String userId);

    Cart addToCart(String userId, Long beatId, String license);

    void removeFromCart(String userId, Long beatId);

    void addToHistory(String userId, Long beatId);

    Page<DisplayBeatDto> getTopChart(String nameFilter, Filters filters, String userId, Pageable pageable);

    Page<DisplayBeatDto> getFavoriteBeats(String userId, Pageable pageable);

    Page<DisplayBeatDto> getHistoryBeats(String userId, Pageable pageable);

    Page<DisplayBeatDto> getBeats(String userId, String authUserId, Pageable pageable);

    List<Beat> getDrafts(String userId);

    List<Beat> getSold(String userId);

    List<Beat> getSimilarBeats(Long beatId, Integer limit);

    Page<DisplayBeatDto> getFreeBeats(String userId, Pageable pageable);

    Page<DisplayBeatDto> findAllByGenre(String userId, String genre, Pageable pageable);

    Page<DisplayBeatDto> findAllByTag(String userId, Long tagId, Pageable pageable);

    void publication(String userId, Long beatId);
}
