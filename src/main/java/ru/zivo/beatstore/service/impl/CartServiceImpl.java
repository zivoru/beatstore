package ru.zivo.beatstore.service.impl;

import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Override
    public List<CartDto> findByUserId(Long userId) {
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
}
