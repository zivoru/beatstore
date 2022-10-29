package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    private static final String USER_ID = "1";

    @Mock
    private CartRepository cartRepository;
    @Mock
    private UserService userService;
    @Mock
    private BeatService beatService;
    @InjectMocks
    private CartServiceImpl cartService;

    @Nested
    class FindCartByUserId {

        @Test
        void FindCartByUserId_LicensingEqualToMp3() {
            findCartByUserIdTest(Licensing.MP3, 100);
        }

        @Test
        void FindCartByUserId_LicensingEqualToWav() {
            findCartByUserIdTest(Licensing.WAV, 200);
        }

        @Test
        void FindCartByUserId_LicensingEqualToUnlimited() {
            findCartByUserIdTest(Licensing.UNLIMITED, 500);
        }

        @Test
        void FindCartByUserId_LicensingEqualToExclusive() {
            findCartByUserIdTest(Licensing.EXCLUSIVE, 1000);
        }

        void findCartByUserIdTest(Licensing licensing, int price) {
            Beat beat = new Beat();
            beat.setLicense(new License(100, 200, 500, 1000, beat));
            Cart cart = new Cart(licensing, new User(), beat);

            when(userService.findById(USER_ID))
                    .thenReturn(User.builder()
                            .cart(List.of(cart))
                            .build());

            List<CartDto> cartDtoList = cartService.findAllByUserId(USER_ID);

            CartDto cartDto = cartDtoList.get(0);

            assertEquals(licensing, cartDto.getLicensing());
            assertEquals(beat, cartDto.getBeat());
            assertEquals(price, cartDto.getPrice());
        }
    }

    @Nested
    class Delete {

        @Test
        void Delete_CartIsFound_CartDeleted() {
            Cart cart = new Cart();

            when(cartRepository.findByBeatAndUser(any(), any())).thenReturn(Optional.of(cart));

            cartService.delete(null, null);

            verify(cartRepository, times(1)).delete(cart);
        }

        @Test
        void Delete_CartIsNotFound_ThrowException() {
            when(cartRepository.findByBeatAndUser(any(), any())).thenReturn(Optional.empty());
            assertThrows(NotFoundException.class, () -> cartService.delete(null, null));
        }
    }

    @Nested
    class DeleteByAuthorId {

        @Test
        void DeleteByAuthorId_CartsByAuthorNotFound_CartsNotDeleted() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            Cart cart = new Cart();
            cart.setBeat(beat);

            List<Cart> carts = List.of(cart);

            when(cartRepository.findAllByUser(any())).thenReturn(carts);

            cartService.deleteByAuthorId(null, "2");

            verify(cartRepository, never()).delete(cart);
        }

        @Test
        void DeleteByAuthorId_CartsByAuthorFound_CartsDeleted() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            Cart cart = new Cart();
            cart.setBeat(beat);

            List<Cart> carts = List.of(cart);

            when(cartRepository.findAllByUser(any())).thenReturn(carts);

            cartService.deleteByAuthorId(null, USER_ID);

            verify(cartRepository, times(1)).delete(cart);
        }
    }
}