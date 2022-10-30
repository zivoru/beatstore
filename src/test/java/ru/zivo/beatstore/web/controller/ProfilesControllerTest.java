package ru.zivo.beatstore.web.controller;

import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.web.dto.ProfileDto;

import java.util.ArrayList;
import java.util.Map;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.assertj.core.api.Assertions.assertThat;

@RequiredArgsConstructor
class ProfilesControllerTest extends AbstractIntegrationTest {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    private User user = User.builder()
            .id("1")
            .email("email")
            .username("name")
            .verified(false)
            .status(Status.ACTIVE)
            .build();

    @BeforeEach
    void saveUser() {
        user = userRepository.save(user);
    }

    @Test
    void getProfileByIdUser() {
        Profile profile = new Profile(null, "ivan", "ivanov", "ivan", "moscow", null, user);
        user.setProfile(profile);
        userRepository.save(user);

        Profile actual = given()
                .contentType(ContentType.JSON)
                .get("/api/v1/profiles/" + user.getId())
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(Profile.class);

        assertThat(actual.getFirstName()).isEqualTo(profile.getFirstName());
        assertThat(actual.getLastName()).isEqualTo(profile.getLastName());
        assertThat(actual.getDisplayName()).isEqualTo(profile.getDisplayName());
        assertThat(actual.getLocation()).isEqualTo(profile.getLocation());
        assertThat(actual.getBiography()).isEqualTo(profile.getBiography());
    }

    @Test
    void updateProfile() {
        DefaultOAuth2User principal = new DefaultOAuth2User(new ArrayList<>(), Map.of("sub", "1"), "sub");

        Profile profile = profileRepository.save(new Profile(null, null, null, null, null, null, user));

        user.setProfile(profile);
        userRepository.save(user);

        ProfileDto profileDto = new ProfileDto(null, "ivan", "ivanov", "ivan", "moscow", null, user);

        Long actual = given()
                .auth().principal(principal)
                .body(profileDto)
                .contentType(ContentType.JSON)
                .put("/api/v1/profiles")
                .then()
                .log().body()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(Long.class);

        assertThat(actual).isEqualTo(profile.getId());

        Profile updatedProfile = profileRepository.findById(actual).get();

        assertThat(updatedProfile.getFirstName()).isEqualTo(profileDto.getFirstName());
        assertThat(updatedProfile.getLastName()).isEqualTo(profileDto.getLastName());
        assertThat(updatedProfile.getDisplayName()).isEqualTo(profileDto.getDisplayName());
        assertThat(updatedProfile.getLocation()).isEqualTo(profileDto.getLocation());
        assertThat(updatedProfile.getBiography()).isEqualTo(profileDto.getBiography());
    }
}