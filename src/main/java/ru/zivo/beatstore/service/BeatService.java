package ru.zivo.beatstore.service;

import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Purchased;

import java.io.IOException;
import java.util.Set;

public interface BeatService {

    Beat create(Long userId, Beat beat);

    Beat update(Beat beat);

    Beat findById(Long id);

    void addPlay(Long id);

    Set<Beat> getBeats(Long userId);

    Set<Cart> getCart(Long userId);

    Set<Purchased> getPurchasedBeats(Long userId);

    Set<Beat> getFavoriteBeats(Long userId);

    Set<Beat> getHistoryBeats(Long userId);

    void delete(Long id);

    Beat uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException;
}
