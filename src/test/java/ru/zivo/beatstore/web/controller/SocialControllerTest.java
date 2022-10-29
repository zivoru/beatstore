package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Social;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.SocialRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.web.dto.SocialDto;

import java.util.ArrayList;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;

class SocialControllerTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocialRepository socialRepository;

    @Test
    void update() {
        User user = userRepository.save(User.builder()
                .id("1")
                .email("email")
                .username("name")
                .verified(false)
                .status(Status.ACTIVE)
                .build());

        Social social = new Social();
        social.setUser(user);
        Social savedSocial = socialRepository.save(social);
        user.setSocial(savedSocial);
        userRepository.save(user);

        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        final String instagram = "instagram";
        final String tiktok = "tiktok";
        final String youtube = "youtube";
        final String vk = "vk";

        given()
                .auth().principal(principal)
                .contentType(ContentType.JSON)
                .body(SocialDto.builder()
                        .instagram(instagram)
                        .youtube(youtube)
                        .tiktok(tiktok)
                        .vkontakte(vk)
                        .build())
                .put("/api/v1/socials")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value());

        assert savedSocial.getId() != null;
        Social actual = socialRepository.findById(savedSocial.getId()).get();

        assertThat(actual.getInstagram()).isEqualTo(instagram);
        assertThat(actual.getYoutube()).isEqualTo(youtube);
        assertThat(actual.getTiktok()).isEqualTo(tiktok);
        assertThat(actual.getVkontakte()).isEqualTo(vk);
    }
}