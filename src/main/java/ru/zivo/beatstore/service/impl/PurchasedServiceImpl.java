package ru.zivo.beatstore.service.impl;

import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.service.PurchasedService;
import ru.zivo.beatstore.service.impl.common.Users;

import java.util.Collections;
import java.util.List;

@Service
public class PurchasedServiceImpl implements PurchasedService {

    @Override
    public List<Purchased> getPurchasedBeats(String userId) {
        List<Purchased> purchased = Users.getUser(userId).getPurchased();
        Collections.reverse(purchased);
        return purchased;
    }
}
