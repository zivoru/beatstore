package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.ArrayList;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;

class RegistrationControllerTest extends AbstractIntegrationTest {

    @Test
    void user() {
        Map map = given()
                .contentType(ContentType.JSON)
                .get("/user")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(Map.class);

        assertThat(map).isEmpty();


        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(),
                Map.of("sub", "1", "name", "ivan", "email", "ivan@gmail.com"), "sub");

        Map map2 = given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .get("/user")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(Map.class);

        assertThat(map2).containsKey("user");
    }
}