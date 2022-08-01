package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.Purchased;

import java.util.List;

public interface PurchasedService {

    List<Purchased> getPurchasedBeats(String userId);
}
