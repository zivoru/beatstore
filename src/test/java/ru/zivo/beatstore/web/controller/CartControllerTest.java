package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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

class CartControllerTest extends AbstractIntegrationTest {

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

    @BeforeEach
    void saveUserAndBeat() {
        user = userRepository.save(user);
        beat = beatRepository.save(beat);
    }

    @Test
    void findCartByUserId() {
        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .get("/api/v1/carts/")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", empty());

        Cart cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));
        user.getCart().add(cart);
        userRepository.save(user);

        beat.setLicense(new License(100, 200, 500, 1000, beat));
        beatRepository.save(beat);

        given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .get("/api/v1/carts/")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(1));
    }

    @Test
    void delete() {
        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        Cart cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));

        given()
                .auth().principal(principal)
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
        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        Cart cart = cartRepository.save(new Cart(Licensing.WAV, user, beat));

        given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .delete("/api/v1/carts/userId/" + user.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assert cart.getId() != null;
        assertThat(cartRepository.findAllByUser(user)).isEmpty();
    }
}