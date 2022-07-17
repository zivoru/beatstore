package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.CartService;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;

    @Autowired
    public CartServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<Cart> findByUserId(Long userId) {
        User user = getUser(userId);

        List<Cart> carts = user.getCart();

        List<Cart> publishedBeats = new ArrayList<>();

        for (Cart cart : carts) {
            if (cart.getBeat().getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(cart);
            }
        }

        return publishedBeats;
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(userId)));
    }
}
