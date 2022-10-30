package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.*;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.repository.UserRepository;

import java.util.ArrayList;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;

@RequiredArgsConstructor
class CartControllerTest extends AbstractIntegrationTest {

    public static final DefaultOAuth2User PRINCIPAL = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

    private final UserRepository userRepository;
    private final BeatRepository beatRepository;
    private final CartRepository cartRepository;

    private User user = User.builder()
            .id("1")
            .email("email")
            .username("name")
            .verified(false)
            .status(Status.ACTIVE)
            .cart(new ArrayList<>())
            .build();

    private Beat beat = Beat.builder()
            .title("title")
            .user(user)
            .status(BeatStatus.PUBLISHED)
            .free(false)
            .genre(Genre.DRILL)
            .mood(Mood.ANGRY)
            .plays(0)
            .comments(new ArrayList<>())
            .build();

    Cart cart;

    @BeforeEach
    void saveUserAndBeat() {
        user = userRepository.save(user);
        beat = beatRepository.save(beat);
        cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));
    }

    @Test
    void findCartByUserId() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .get("/api/v1/carts/")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", empty());

        user.getCart().add(cart);
        userRepository.save(user);

        beat.setLicense(new License(100, 200, 500, 1000, beat));
        beatRepository.save(beat);

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .get("/api/v1/carts/")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(1));
    }

    @Test
    void delete() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .delete("/api/v1/carts/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assert cart.getId() != null;
        assertThat(cartRepository.findById(cart.getId())).isEmpty();
    }

    @Test
    void deleteByUserId() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .delete("/api/v1/carts/userId/" + user.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assert cart.getId() != null;
        assertThat(cartRepository.findAllByUser(user)).isEmpty();
    }
}