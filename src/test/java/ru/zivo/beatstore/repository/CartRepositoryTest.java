package ru.zivo.beatstore.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.zivo.beatstore.TestWithContext;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.*;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@TestWithContext
class CartRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BeatRepository beatRepository;

    @Autowired
    private CartRepository cartRepository;

    private User user = User.builder()
            .id("1")
            .email("email")
            .username("name")
            .verified(false)
            .status(Status.ACTIVE)
            .build();

    private Beat beat = Beat.builder()
            .title("beat")
            .user(user)
            .status(BeatStatus.PUBLISHED)
            .free(false)
            .genre(Genre.DRILL)
            .mood(Mood.ANGRY)
            .plays(0)
            .build();

    @BeforeEach
    void saveUserAndBeat() {
        user = userRepository.save(user);
        beat = beatRepository.save(beat);
    }

    @Test
    void existsByBeatAndUserAndLicensing() {
        Cart cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));
        assertTrue(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.WAV));
        assertFalse(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.MP3));
        assertFalse(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.UNLIMITED));
        assertFalse(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.EXCLUSIVE));
        cartRepository.delete(cart);
        assertFalse(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.WAV));
    }

    @Test
    void findByBeatAndUser() {
        Cart cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));
        Optional<Cart> optionalCart = cartRepository.findByBeatAndUser(beat, user);
        assertThat(optionalCart).isNotEmpty();
        assertThat(optionalCart.get()).isEqualTo(cart);
    }

    @Test
    void findAllByBeat() {
        List<Cart> carts = cartRepository.findAllByBeat(beat);
        assertThat(carts).isEmpty();

        Cart cart1 = new Cart(Licensing.WAV, user, beat);
        Cart cart2 = new Cart(Licensing.EXCLUSIVE, user, beat);
        cartRepository.save(cart1);
        cartRepository.save(cart2);

        carts = cartRepository.findAllByBeat(beat);
        assertThat(carts).contains(cart1, cart2);
    }

    @Test
    void findAllByUser() {
        List<Cart> carts = cartRepository.findAllByUser(user);
        assertThat(carts).isEmpty();

        Cart cart1 = new Cart(Licensing.WAV, user, beat);
        Cart cart2 = new Cart(Licensing.EXCLUSIVE, user, beat);
        cartRepository.save(cart1);
        cartRepository.save(cart2);

        carts = cartRepository.findAllByUser(user);
        assertThat(carts).contains(cart1, cart2);
    }
}