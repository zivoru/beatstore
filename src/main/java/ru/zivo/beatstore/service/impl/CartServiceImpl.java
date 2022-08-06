package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public List<CartDto> findCartByUserId(String userId) {
        List<Cart> publishedBeats = new ArrayList<>();

        for (Cart cart : Users.getUser(userId).getCart()) {
            if (cart.getBeat().getStatus() == BeatStatus.PUBLISHED) publishedBeats.add(cart);
        }

        List<CartDto> cartDtoList = new ArrayList<>();

        for (Cart cart : publishedBeats) {
            CartDto cartDto = CartDto.builder()
                    .licensing(cart.getLicensing())
                    .beat(cart.getBeat())
                    .build();

            final License license = cart.getBeat().getLicense();
            int price = switch (cart.getLicensing()) {
                case MP3 -> license.getPrice_mp3();
                case WAV -> license.getPrice_wav();
                case UNLIMITED -> license.getPrice_unlimited();
                case EXCLUSIVE -> license.getPrice_exclusive();
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
