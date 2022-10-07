package ru.zivo.beatstore.service.impl;

import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.service.PurchasedService;
import ru.zivo.beatstore.service.UserService;

import java.util.Collections;
import java.util.List;

@Service
public class PurchasedServiceImpl implements PurchasedService {

    private final UserService userService;

    public PurchasedServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public List<Purchased> getPurchasedBeats(String userId) {
        List<Purchased> purchased = userService.findById(userId).getPurchased();
        Collections.reverse(purchased);
        return purchased;
    }
}
