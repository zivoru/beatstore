package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Genre;
import ru.zivo.beatstore.model.enums.Mood;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CommentRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.web.dto.CommentDto;

import java.util.ArrayList;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RequiredArgsConstructor
class CommentControllerTest extends AbstractIntegrationTest {

    public static final DefaultOAuth2User PRINCIPAL = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

    private final UserRepository userRepository;
    private final BeatRepository beatRepository;
    private final CommentRepository commentRepository;

    private User user = User.builder()
            .id("1")
            .email("email")
            .username("name")
            .verified(false)
            .status(Status.ACTIVE)
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
    void findByBeatId() {
        given()
                .contentType(ContentType.JSON)
                .get("/api/v1/comments/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("$", equalTo(beat.getComments()));
    }

    @Test
    void addComment() {
        CommentDto comment = new CommentDto("new comment", beat, user);

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .body(comment)
                .post("/api/v1/comments/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("comment", equalTo(comment.getText()))
                .body("author.id", equalTo(user.getId()));
    }

    @Test
    void delete() {
        Comment comment = commentRepository.save(new Comment("new comment", beat, user));

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .delete("/api/v1/comments/" + comment.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assert comment.getId() != null;
        assertThat(commentRepository.findById(comment.getId())).isEmpty();
    }
}