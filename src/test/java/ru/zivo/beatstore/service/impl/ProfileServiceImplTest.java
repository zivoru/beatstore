package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.service.UserService;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

    private static final String USER_ID = "1";
    private static final long PROFILE_ID = 1L;

    @Mock
    BeatstoreProperties beatstoreProperties;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private ProfileServiceImpl profileService;

    @Nested
    class UpdateProfile {

        @Test
        void UpdateProfile_ProfileUpdated_FieldsUpdated() {
            Profile profile = new Profile();

            when(userService.findById(USER_ID)).thenReturn(User.builder().profile(profile).build());

            Profile updatedProfile = new Profile();

            updatedProfile.setFirstName("FirstName");
            updatedProfile.setLastName("LastName");
            updatedProfile.setDisplayName("DisplayName");
            updatedProfile.setLocation("Location");
            updatedProfile.setBiography("Biography");

            profileService.updateProfile(USER_ID, updatedProfile);

            assertAll(
                    () -> assertEquals(updatedProfile.getFirstName(), profile.getFirstName()),
                    () -> assertEquals(updatedProfile.getLastName(), profile.getLastName()),
                    () -> assertEquals(updatedProfile.getDisplayName(), profile.getDisplayName()),
                    () -> assertEquals(updatedProfile.getLocation(), profile.getLocation()),
                    () -> assertEquals(updatedProfile.getBiography(), profile.getBiography())
            );
        }

        @Test
        void UpdateProfile_UserIdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> profileService.updateProfile(null, new Profile()));
        }

        @Test
        void UpdateProfile_ProfileIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> profileService.updateProfile(USER_ID, null));
        }
    }

    @Nested
    class UpdateImage {

        @Test
        void UpdateImage_ProfileIdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> profileService.updateImage(null, null));
        }

        @Test
        void UpdateImage_ProfileIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> profileService.updateImage(PROFILE_ID, null));
        }

        @Test
        void UpdateImage_PhotoIsNull_NoUpdateImage() throws IOException {
            Profile profile = new Profile();
            profile.setUser(User.builder().id(USER_ID).build());

            String name = "name";
            profile.setImageName(name);

            when(profileRepository.findById(PROFILE_ID)).thenReturn(Optional.of(profile));

            profileService.updateImage(PROFILE_ID, null);

            assertEquals(name, profile.getImageName());
        }

        @Test
        void UpdateImage_PhotoIsNotNull_UpdateImage() throws IOException {
            Profile profile = new Profile();
            profile.setUser(User.builder().id(USER_ID).build());

            String name = "name";
            profile.setImageName(name);

            when(profileRepository.findById(PROFILE_ID)).thenReturn(Optional.of(profile));

            profileService.updateImage(PROFILE_ID, new MockMultipartFile("name", new byte[0]));

            assertNotEquals(name, profile.getImageName());
        }
    }
}