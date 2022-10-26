package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final UserService userService;

    private final BeatService beatService;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, UserService userService, BeatService beatService) {
        this.cartRepository = cartRepository;
        this.userService = userService;
        this.beatService = beatService;
    }

    @Override
    public List<CartDto> findAllByUserId(String userId) {
        List<Cart> carts = userService.findById(userId).getCart();

        return carts == null
                ? new ArrayList<>()
                : carts.stream()
                .map(cart -> CartDto.builder()
                        .licensing(cart.getLicensing())
                        .beat(cart.getBeat())
                        .price(switch (cart.getLicensing()) {
                            case MP3 -> cart.getBeat().getLicense().getPriceMp3();
                            case WAV -> cart.getBeat().getLicense().getPriceWav();
                            case UNLIMITED -> cart.getBeat().getLicense().getPriceUnlimited();
                            case EXCLUSIVE -> cart.getBeat().getLicense().getPriceExclusive();
                        })
                        .build())
                .toList();
    }

    @Override
    public void delete(String authUserId, Long beatId) {
        Cart cart = cartRepository
                .findByBeatAndUser(beatService.findById(beatId), userService.findById(authUserId))
                .orElseThrow(() -> new NotFoundException("Корзина не найдена"));

        cartRepository.delete(cart);
    }

    @Override
    public void deleteByAuthorId(String authUserId, String authorId) {
        User authUser = userService.findById(authUserId);
        List<Cart> carts = cartRepository.findAllByUser(authUser);
        for (Cart cart : carts) {
            User author = cart.getBeat().getUser();

            if (author.getId().equals(authorId)) {
                cartRepository.delete(cart);
            }
        }
    }
}
