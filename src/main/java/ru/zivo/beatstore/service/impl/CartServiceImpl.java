package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final UserService userService;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.userService = userService;
    }

    @Override
    public List<CartDto> findCartByUserId(String userId) {
        List<Cart> publishedBeats = userService.findById(userId).getCart()
                .stream()
                .filter(cart -> cart.getBeat().getStatus() == BeatStatus.PUBLISHED)
                .toList();

        List<CartDto> cartDtoList = new ArrayList<>();

        for (Cart cart : publishedBeats) {
            CartDto cartDto = CartDto.builder()
                    .licensing(cart.getLicensing())
                    .beat(cart.getBeat())
                    .build();

            final License license = cart.getBeat().getLicense();
            int price = switch (cart.getLicensing()) {
                case MP3 -> license.getPriceMp3();
                case WAV -> license.getPriceWav();
                case UNLIMITED -> license.getPriceUnlimited();
                case EXCLUSIVE -> license.getPriceExclusive();
            };

            cartDto.setPrice(price);

            cartDtoList.add(cartDto);
        }

        return cartDtoList;
    }

    @Override
    public void delete(String authUserId, Long cartId) {
        List<Cart> carts = cartRepository.findAll();
        for (Cart cart : carts) {
            if (Objects.equals(cart.getBeat().getId(), cartId) && cart.getUser().getId().equals(authUserId)) {
                cartRepository.delete(cart);
            }
        }
    }

    @Override
    public void deleteByUserId(String authUserId, String userId) {
        List<Cart> carts = cartRepository.findAll();
        for (Cart cart : carts) {
            if (cart.getBeat().getUser().getId().equals(userId) && cart.getUser().getId().equals(authUserId)) {
                cartRepository.delete(cart);
            }
        }
    }
}
