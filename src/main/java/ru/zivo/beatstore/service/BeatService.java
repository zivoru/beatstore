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
import java.util.Set;

public interface BeatService {

    Beat create(Long userId, Beat beat);

    void uploadImage(Long beatId, MultipartFile image) throws IOException;

    void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException;

    void addTags(Long beatId, List<Tag> tags);

    Beat update(Beat beat);

    Beat findById(Long id);

    void addPlay(Long id);

    void delete(Long id);

    List<Beat> getTrendBeats(Integer limit);

    void addAndDeleteFavorite(Long beatId, Long userId);

    Cart addToCart(Long userId, Long beatId, String license);

    void addToHistory(Long userId, Long beatId);

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

    void addLicense(Long beatId, License license);

    Page<BeatDto> getFavoriteBeats(Long userId, Pageable pageable);

    Page<BeatDto> getHistoryBeats(Long userId, Pageable pageable);

    Page<BeatDto> getBeats(Long userId, Long authUserId, Pageable pageable);
}
