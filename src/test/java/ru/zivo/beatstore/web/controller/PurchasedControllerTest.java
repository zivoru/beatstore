package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.hamcrest.Matchers.equalTo;

class PurchasedControllerTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void getPurchased() {
        User user = userRepository.save(User.builder()
                .id("1")
                .email("email")
                .username("name")
                .purchased(new ArrayList<>())
                .verified(false)
                .status(Status.ACTIVE)
                .build());

        List<Purchased> expected = user.getPurchased();

        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .get("/api/v1/purchased")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", equalTo(expected));
    }
}