package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.web.dto.BeatDto;

import java.io.IOException;
import java.util.List;

public interface BeatService {

    Beat findById(Long id);

    Beat create(Long userId, Beat beat);

    void update(Beat beat);

    void delete(Long id);

    void uploadImage(Long beatId, MultipartFile image) throws IOException;

    void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException;

    void addTags(Long beatId, List<Tag> tags);

    void addLicense(Long beatId, License license);

    void addPlay(Long id);

    void addToFavorite(Long beatId, Long userId);

    void removeFromFavorite(Long beatId, Long userId);

    Cart addToCart(Long userId, Long beatId, String license);

    void removeFromCart(Long userId, Long beatId);

    void addToHistory(Long userId, Long beatId);

    List<Beat> getTrendBeats(Integer limit);

    Page<BeatDto> getTopChart(String nameFilter,
                              Long tag,
                              String genre,
                              Integer priceMin,
                              Integer priceMax,
                              String key,
                              String mood,
                              Integer bpmMin,
                              Integer bpmMax,
                              Long userId,
                              Pageable pageable);

    Page<BeatDto> getFavoriteBeats(Long userId, Pageable pageable);

    Page<BeatDto> getHistoryBeats(Long userId, Pageable pageable);

    Page<BeatDto> getBeats(Long userId, Long authUserId, Pageable pageable);
}
