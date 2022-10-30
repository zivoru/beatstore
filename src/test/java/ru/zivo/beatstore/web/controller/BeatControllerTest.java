package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.*;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.web.dto.BeatDto;
import ru.zivo.beatstore.web.dto.LicenseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

@RequiredArgsConstructor
class BeatControllerTest extends AbstractIntegrationTest {

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
            .status(BeatStatus.DRAFT)
            .free(false)
            .genre(Genre.DRILL)
            .mood(Mood.ANGRY)
            .plays(0)
            .comments(new ArrayList<>())
            .build();

    private static final DefaultOAuth2User PRINCIPAL = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

    @BeforeEach
    void saveUser() {
        user = userRepository.save(user);
        beat = beatRepository.save(beat);
    }

    @Test
    void findById() {
        given()
                .contentType(ContentType.JSON)
                .get("/api/v1/beats/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("title", equalTo(beat.getTitle()));
    }

    @Test
    void findDtoById() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .get("/api/v1/beats/dto/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .body("beat.title", equalTo(beat.getTitle()));
    }

    @Test
    void create() {
        BeatDto beatDto = new BeatDto("new beat", null, true, Genre.DRILL, Mood.ANGRY, null, 140, Key.ABM, 0,
                BeatStatus.PUBLISHED, null, null, user, null, null, null);

        Long id = given()
                .auth().principal(PRINCIPAL)
                .body(beatDto)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(Long.class);

        Beat newBeat = beatRepository.findById(id).get();

        assertThat(newBeat.getTitle()).isEqualTo(beatDto.getTitle());
        assertThat(newBeat.getImageName()).isEqualTo(beatDto.getImageName());
        assertThat(newBeat.getFree()).isEqualTo(beatDto.getFree());
        assertThat(newBeat.getGenre()).isEqualTo(beatDto.getGenre());
    }

    @Test
    void update() {
        BeatDto beatDto = new BeatDto("new beat", null, true, Genre.DRILL, Mood.ANGRY, null, 140, Key.ABM, 0,
                BeatStatus.PUBLISHED, null, null, user, null, null, null);

        given()
                .auth().principal(PRINCIPAL)
                .body(beatDto)
                .contentType(ContentType.JSON)
                .put("/api/v1/beats/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        Beat newBeat = beatRepository.findById(beat.getId()).get();

        assertThat(newBeat.getTitle()).isEqualTo(beatDto.getTitle());
        assertThat(newBeat.getImageName()).isEqualTo(beatDto.getImageName());
        assertThat(newBeat.getFree()).isEqualTo(beatDto.getFree());
        assertThat(newBeat.getGenre()).isEqualTo(beatDto.getGenre());
    }

    @Test
    void publication() {
        assertThat(beatRepository.findById(beat.getId()).get().getStatus()).isEqualTo(BeatStatus.DRAFT);

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .put("/api/v1/beats/publication/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assertThat(beatRepository.findById(beat.getId()).get().getStatus()).isEqualTo(BeatStatus.PUBLISHED);
    }

    @Test
    void delete() {
        assertThat(beatRepository.findById(beat.getId())).isNotEmpty();

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .delete("/api/v1/beats/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assertThat(beatRepository.findById(beat.getId())).isEmpty();
    }

    @Test
    void createTag() {
        given()
                .auth().principal(PRINCIPAL)
                .param("nameTag1", "drill")
                .param("nameTag2", "808")
                .param("nameTag3", "free")
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/createTag/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        Beat beat1 = beatRepository.findById(beat.getId()).get();
        assertThat(beat1.getTags()).hasSize(3);
        assertThat(beat1.getTags().get(0).getName()).isEqualTo("drill");
        assertThat(beat1.getTags().get(1).getName()).isEqualTo("808");
        assertThat(beat1.getTags().get(2).getName()).isEqualTo("free");
    }

    @Test
    void addLicense() {
        int priceMp3 = 100, priceWav = 200, priceUnlimited = 500, priceExclusive = 1000;

        LicenseDto licenseDto = new LicenseDto(priceMp3, priceWav, priceUnlimited, priceExclusive);

        given()
                .body(licenseDto)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/createLicense/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        Beat beat1 = beatRepository.findById(beat.getId()).get();
        assertThat(beat1.getLicense().getPriceMp3()).isEqualTo(priceMp3);
        assertThat(beat1.getLicense().getPriceWav()).isEqualTo(priceWav);
        assertThat(beat1.getLicense().getPriceUnlimited()).isEqualTo(priceUnlimited);
        assertThat(beat1.getLicense().getPriceExclusive()).isEqualTo(priceExclusive);
    }

    @Test
    void addPlay() {
        Integer before = beatRepository.findById(beat.getId()).get().getPlays();

        given()
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/plays/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        Integer after = beatRepository.findById(beat.getId()).get().getPlays();
        assertThat(after).isEqualTo(before + 1);
    }

    @Test
    void addToFavorite() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/addToFavorite/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        User user1 = userRepository.findById("1").get();
        assertThat(user1.getFavoriteBeats()).contains(beat);
    }

    @Test
    void removeFromFavorite() {
        user.setFavoriteBeats(new ArrayList<>(List.of(beat)));
        userRepository.save(user);

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/removeFromFavorite/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        User user1 = userRepository.findById("1").get();
        assertThat(user1.getFavoriteBeats()).doesNotContain(beat);
    }

    @Test
    void addToCart() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/beat/" + beat.getId() + "/license/" + "WAV")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assertThat(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.WAV)).isTrue();
    }

    @Test
    void removeFromCart() {
        Cart cart = new Cart(Licensing.WAV, user, beat);
        cartRepository.save(cart);

        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/removeFromCart/beat/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assertThat(cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.WAV)).isFalse();
    }

    @Test
    void addToHistory() {
        given()
                .auth().principal(PRINCIPAL)
                .contentType(ContentType.JSON)
                .post("/api/v1/beats/beat/" + beat.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assertThat(userRepository.findById("1").get().getHistory()).contains(beat);
    }
}