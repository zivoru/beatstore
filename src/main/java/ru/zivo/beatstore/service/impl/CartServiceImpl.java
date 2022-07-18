package ru.zivo.beatstore.service.impl;

import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.impl.common.Users;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Override
    public List<Cart> findByUserId(Long userId) {
        User user = Users.getUser(userId);

        List<Cart> carts = user.getCart();

        List<Cart> publishedBeats = new ArrayList<>();

        for (Cart cart : carts) {
            if (cart.getBeat().getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(cart);
            }
        }

        return publishedBeats;
    }
}
