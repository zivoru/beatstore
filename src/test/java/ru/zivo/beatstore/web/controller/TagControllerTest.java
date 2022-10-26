package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;

class TagControllerTest extends AbstractIntegrationTest {

    @Test
    void findById() {
        given()
                .contentType(ContentType.JSON)
                .get("/api/v1/tags/1")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("name", equalTo("drill"))
                .body("id", equalTo(1));
    }

    @Test
    void getTrendTags() {
        given()
                .contentType(ContentType.JSON)
                .get("/api/v1/tags/trend-tags?limit=5")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(5));
    }

    @Test
    void findPage() {
        given()
                .contentType(ContentType.JSON)
                .get("/api/v1/tags")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("content", hasSize(8));
    }
}