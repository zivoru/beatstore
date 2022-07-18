package ru.zivo.beatstore.service.impl;

import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Override
    public List<CartDto> findByUserId(Long userId) {
        User user = Users.getUser(userId);

        List<Cart> carts = user.getCart();

        List<Cart> publishedBeats = new ArrayList<>();

        for (Cart cart : carts) {
            if (cart.getBeat().getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(cart);
            }
        }

        List<CartDto> cartDtoList = new ArrayList<>();

        for (Cart cart : publishedBeats) {
            CartDto cartDto = CartDto.builder()
                    .beat(cart.getBeat())
                    .build();

            if (cart.getLicensing() == Licensing.MP3) {
                cartDto.setPrice(cart.getBeat().getLicense().getPrice_mp3());
            }

            if (cart.getLicensing() == Licensing.WAV) {
                cartDto.setPrice(cart.getBeat().getLicense().getPrice_wav());
            }

            if (cart.getLicensing() == Licensing.UNLIMITED) {
                cartDto.setPrice(cart.getBeat().getLicense().getPrice_unlimited());
            }

            if (cart.getLicensing() == Licensing.EXCLUSIVE) {
                cartDto.setPrice(cart.getBeat().getLicense().getPrice_exclusive());
            }

            cartDtoList.add(cartDto);
        }

        return cartDtoList;
    }
}
