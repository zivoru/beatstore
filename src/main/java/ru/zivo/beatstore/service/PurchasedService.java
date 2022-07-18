package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.model.Purchased;

public interface PurchasedService {

    Page<Purchased> getPurchasedBeats(Long userId, Pageable pageable);
}
