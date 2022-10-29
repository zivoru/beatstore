package ru.zivo.beatstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.PurchasedService;
import ru.zivo.beatstore.service.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchasedServiceImpl implements PurchasedService {

    private final UserService userService;

    @Override
    public List<Purchased> getPurchasedBeats(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is null");
        }
        User user = userService.findById(userId);
        return user.getPurchased();
    }
}
