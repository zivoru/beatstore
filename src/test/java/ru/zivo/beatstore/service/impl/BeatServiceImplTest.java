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
import ru.zivo.beatstore.exception.NoMatchException;
import ru.zivo.beatstore.model.*;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.repository.*;
import ru.zivo.beatstore.service.UserService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeatServiceImplTest {

    private static final long BEAT_ID = 1L;
    private static final String USER_ID = "1";

    @Mock
    private BeatstoreProperties beatstoreProperties;
    @Mock
    private BeatRepository beatRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AudioRepository audioRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private LicenseRepository licenseRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private BeatServiceImpl beatService;

    @Nested
    class FindById {

        @Test
        void FindById_BeatIsFound_ReturnBeat() {
            Beat beat = new Beat();
            beat.setId(BEAT_ID);

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            assertThat(beatService.findById(BEAT_ID)).isEqualTo(beat);
        }

        @Test
        void FindById_BeatIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> beatService.findById(BEAT_ID));
        }

        @Test
        void FindById_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> beatService.findById(null));
        }
    }

    @Test
    void findDtoById() {
        Beat beat = new Beat();
        beat.setId(BEAT_ID);

        User user = new User();
        user.getCart().add(new Cart(Licensing.EXCLUSIVE, user, beat));

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));
        when(userService.findById(USER_ID)).thenReturn(user);

        assertThat(beatService.findDtoById(USER_ID, BEAT_ID).getBeat()).isEqualTo(beat);
    }

    @Nested
    class Create {

        @Test
        void Create_BeatIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> beatService.create(USER_ID, null));
        }

        @Test
        void Create_BeatIsNotNull_BeatSaved() {
            Beat beat = new Beat();
            User user = new User();

            when(userService.findById(USER_ID)).thenReturn(user);
            when(beatRepository.save(beat)).thenReturn(beat);

            Beat savedBeat = beatService.create(USER_ID, beat);

            assertThat(savedBeat.getUser()).isEqualTo(user);
        }
    }

    @Nested
    class Update {

        @Test
        void Update_BeatIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> beatService.update(USER_ID, BEAT_ID, null));
        }

        @Test
        void Update_UsersNotEqual_ThrowException() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            assertThrows(NoMatchException.class, () -> beatService.publication("2", BEAT_ID));
        }

        @Test
        void Update_BeatIsNotNull_BeatUpdated() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            Beat newBeat = new Beat();
            newBeat.setTitle("title");

            beatService.update(USER_ID, BEAT_ID, newBeat);

            verify(beatRepository, times(1)).save(beat);
            assertThat(beat.getTitle()).isEqualTo(newBeat.getTitle());
        }
    }

    @Nested
    class Publication {

        @Test
        void Publication_UsersEqual_BeatPublished() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());
            beat.setStatus(BeatStatus.DRAFT);

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            beatService.publication(USER_ID, BEAT_ID);
            assertThat(beat.getStatus()).isEqualTo(BeatStatus.PUBLISHED);
        }

        @Test
        void Publication_UsersNotEqual_ThrowException() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            assertThrows(NoMatchException.class, () -> beatService.publication("2", BEAT_ID));
        }
    }

    @Nested
    class Delete {

        @Test
        void Delete_UsersNotEqual_ThrowException() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            assertThrows(NoMatchException.class, () -> beatService.delete("2", BEAT_ID));
        }

        @Test
        void Delete_UsersEqual_BeatDeleted() {
            Beat beat = new Beat();
            beat.setUser(User.builder().id(USER_ID).build());

            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

            beatService.delete(USER_ID, BEAT_ID);

            verify(beatRepository, times(1)).delete(beat);
        }
    }

    @Test
    void uploadImage() throws IOException {
        Beat beat = new Beat();
        beat.setUser(User.builder().id(USER_ID).build());

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.uploadImage(BEAT_ID, new MockMultipartFile("name", new byte[0]));

        assertThat(beat.getImageName()).isNotNull();
    }

    @Test
    void uploadAudio() throws IOException {
        Beat beat = new Beat();
        beat.setUser(User.builder().id(USER_ID).build());
        Audio audio = new Audio();
        beat.setAudio(audio);

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.uploadAudio(BEAT_ID,
                new MockMultipartFile("mp3", "mp3", "audio/mpeg", new byte[0]),
                new MockMultipartFile("wav", "wav", "audio/wav", new byte[0]),
                new MockMultipartFile("zip", "zip", "application/zip", new byte[0]));

        assertThat(audio.getMp3Name()).isNotNull();
        assertThat(audio.getMp3OriginalName()).isEqualTo("mp3");
        assertThat(audio.getWavName()).isNotNull();
        assertThat(audio.getWavOriginalName()).isEqualTo("wav");
        assertThat(audio.getZipName()).isNotNull();
        assertThat(audio.getZipOriginalName()).isEqualTo("zip");
    }

    @Test
    void addTags() {
        Beat beat = new Beat();
        List<Tag> list = new ArrayList<>();

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.addTags(BEAT_ID, list);

        assertThat(beat.getTags()).isEqualTo(list);
    }

    @Test
    void addLicense() {
        Beat beat = new Beat();
        License license = new License();
        license.setId(2L);
        beat.setLicense(license);
        License newLicense = new License();

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.addLicense(BEAT_ID, newLicense);

        assertThat(newLicense.getBeat()).isEqualTo(beat);
        assertThat(newLicense.getId()).isEqualTo(license.getId());
    }

    @Test
    void addPlay() {
        Beat beat = new Beat();

        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.addPlay(BEAT_ID);

        assertThat(beat.getPlays()).isEqualTo(1);
    }

    @Test
    void addToFavorite() {
        Beat beat = new Beat();
        User user = new User();

        when(userService.findById(USER_ID)).thenReturn(user);
        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.addToFavorite(BEAT_ID, USER_ID);

        assertThat(user.getFavoriteBeats()).contains(beat);
    }

    @Test
    void removeFromFavorite() {
        Beat beat = new Beat();
        User user = new User();
        user.getFavoriteBeats().add(beat);

        when(userService.findById(USER_ID)).thenReturn(user);
        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.removeFromFavorite(BEAT_ID, USER_ID);

        assertThat(user.getFavoriteBeats()).doesNotContain(beat);
    }

    @Nested
    class AddToCart {

        @Test
        void AddToCart_NoEnumConstant_ThrowException() {
            when(userService.findById(USER_ID)).thenReturn(new User());
            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(new Beat()));

            assertThrows(IllegalArgumentException.class,
                    () -> beatService.addToCart(USER_ID, BEAT_ID, ""));
        }

        @Test
        void AddToCart_ExistsByBeatAndUserAndLicensing_ReturnNull() {
            when(userService.findById(USER_ID)).thenReturn(new User());
            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(new Beat()));
            when(cartRepository.existsByBeatAndUserAndLicensing(any(), any(), any())).thenReturn(true);

            Cart cart = beatService.addToCart(USER_ID, BEAT_ID, "UNLIMITED");

            assertThat(cart).isNull();
        }

        @Test
        void AddToCart_NotExistsByBeatAndUserAndLicensing_CartAdded() {
            Cart testCart = new Cart();
            User user = new User();

            when(userService.findById(USER_ID)).thenReturn(user);
            when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(new Beat()));
            when(cartRepository.existsByBeatAndUserAndLicensing(any(), any(), any())).thenReturn(false);
            when(cartRepository.findByBeatAndUser(any(), any())).thenReturn(Optional.of(testCart));
            when(cartRepository.save(any())).thenReturn(testCart);

            Cart cart = beatService.addToCart(USER_ID, BEAT_ID, "UNLIMITED");

            assertThat(cart.getLicensing()).isEqualTo(Licensing.UNLIMITED);
            assertThat(user.getCart()).contains(cart);
        }
    }

    @Test
    void removeFromCart() {
        Beat beat = new Beat();
        User user = new User();
        Cart cart = new Cart(Licensing.EXCLUSIVE, user, beat);
        user.getCart().add(cart);

        when(userService.findById(USER_ID)).thenReturn(user);
        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));
        when(cartRepository.findByBeatAndUser(beat, user)).thenReturn(Optional.of(cart));

        beatService.removeFromCart(USER_ID, BEAT_ID);

        verify(cartRepository, times(1)).delete(cart);
    }

    @Test
    void addToHistory() {
        Beat beat = new Beat();
        User user = new User();

        when(userService.findById(USER_ID)).thenReturn(user);
        when(beatRepository.findById(BEAT_ID)).thenReturn(Optional.of(beat));

        beatService.addToHistory(USER_ID, BEAT_ID);

        assertThat(user.getHistory()).contains(beat);
    }
}