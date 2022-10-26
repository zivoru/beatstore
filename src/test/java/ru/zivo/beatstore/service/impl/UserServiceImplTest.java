package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Audio;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.repository.SocialRepository;
import ru.zivo.beatstore.repository.UserRepository;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private BeatstoreProperties beatstoreProperties;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private SocialRepository socialRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void register() {
        userService.register("1", "username", "email");
        userService.register("1", "feed", "email");

        verify(userRepository, times(4)).save(any());
    }

    @Nested
    class Update {

        @Test
        void Update_UserUpdated_UsernameAndEmailUpdated() {
            User testUser = User.builder().id("1").build();

            when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

            String email = "ivan@gmail.com";
            String username = "ivan";

            userService.update("1", username, email);

            assertAll(
                    () -> assertEquals(username, testUser.getUsername()),
                    () -> assertEquals(email, testUser.getEmail())
            );
        }

        @Test
        void Update_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class,
                    () -> userService.update(null, "ivan", "ivan@gmail.com"));
        }

        @Test
        void Update_UsernameIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class,
                    () -> userService.update("1", null, "ivan@gmail.com"));
        }

        @Test
        void Update_EmailIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class,
                    () -> userService.update("1", "ivan", null));
        }
    }

    @Nested
    class FindById {

        @Test
        void FindById_UserIsFound_ReturnUser() {
            User testUser = User.builder().id("1").build();

            when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

            assertThat(userService.findById("1")).isEqualTo(testUser);
        }

        @Test
        void FindById_UserIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> userService.findById("-1"));
        }

        @Test
        void FindById_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> userService.findById(null));
        }
    }

    @Nested
    class FindByUsername {

        @Test
        void FindByUsername_UserIsFound_ReturnTrue() {
            User testUser = User.builder().username("ivan").build();

            when(userRepository.findByUsername("ivan")).thenReturn(Optional.of(testUser));

            assertThat(userService.findByUsername("ivan")).isTrue();
        }

        @Test
        void FindByUsername_UserIsNotFound_ReturnFalse() {
            assertFalse(userService.findByUsername("stepan"));
        }

        @Test
        void FindByUsername_UsernameIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> userService.findByUsername(null));
        }
    }

    @Nested
    class Delete {

        @Test
        void Delete_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> userService.delete(null));
        }

        @Test
        void Delete_UserIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> userService.delete("-1"));
        }

        @Test
        void Delete_UserIsFound_UserDeleted() {
            Beat beat = new Beat();
            beat.setAudio(new Audio("mp3", null, "wav", null,
                    "zip", null, beat));
            User testUser = User.builder().beats(List.of(beat)).build();

            when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

            userService.delete("1");

            verify(userRepository, times(1)).delete(testUser);
        }
    }

    @Nested
    class GetRecommended {

        @Test
        void GetRecommended_NoUserAdded_UsersEmpty() {
            List<User> list = new ArrayList<>();

            when(userRepository.findAll()).thenReturn(list);

            List<User> users = userService.getRecommended(list.size());

            assertThat(users).isEmpty();
        }

        @Test
        void GetRecommended_LimitIsZero_UsersEmpty() {
            List<User> list = new ArrayList<>(List.of(new User()));

            when(userRepository.findAll()).thenReturn(list);

            List<User> users = userService.getRecommended(0);

            assertThat(users).isEmpty();
        }

        @Test
        void GetRecommended_LimitIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> userService.getRecommended(null));
        }

        @Test
        void GetRecommended_UserAdded_UsersSize() {
            List<User> list = new ArrayList<>(List.of(new User(), new User()));

            when(userRepository.findAll()).thenReturn(list);

            List<User> users = userService.getRecommended(list.size());

            assertThat(users).hasSize(2);
        }

        @Test
        void GetRecommended_UserAdded_UsersSortedBySizeSubscribers() {
            User user1 = User.builder().subscribers(new HashSet<>()).build();
            User user2 = User.builder().subscribers(Set.of(user1)).build();

            List<User> list = new ArrayList<>(List.of(user1, user2));

            when(userRepository.findAll()).thenReturn(list);

            List<User> users = userService.getRecommended(list.size());

            assertEquals(user2, users.get(0));
            assertEquals(user1, users.get(1));
        }
    }

    @Nested
    class GetDisplayUserDto {

        @Test
        void GetDisplayUserDto_AuthUserIdIsNotNull() {
            User user = User.builder()
                    .username("name")
                    .subscribers(new HashSet<>())
                    .beats(new ArrayList<>())
                    .build();

            User authUser = new User();
            authUser.setSubscriptions(new HashSet<>(Set.of(user)));

            when(userRepository.findByUsername("name")).thenReturn(Optional.of(user));
            when(userRepository.findById("1")).thenReturn(Optional.of(authUser));

            userService.getDisplayUserDto("name", "1");
        }

        @Test
        void GetDisplayUserDto_AuthUserIdIsNull() {
            User user = User.builder()
                    .username("name")
                    .subscribers(new HashSet<>())
                    .beats(new ArrayList<>())
                    .build();

            when(userRepository.findByUsername("name")).thenReturn(Optional.of(user));

            userService.getDisplayUserDto("name", null);
        }
    }

    @Nested
    class SubscribeAndUnsubscribe {

        @Test
        void SubscribeAndUnsubscribe_UserIsNotSubscribed_UserSubscribed() {
            User channel = new User();
            User user = new User();

            when(userRepository.findById("1")).thenReturn(Optional.of(user));
            when(userRepository.findById("2")).thenReturn(Optional.of(channel));

            boolean subscribed = userService.subscribeAndUnsubscribe("1", "2");

            assertTrue(subscribed);

            assertThat(user.getSubscriptions()).contains(channel);
        }

        @Test
        void SubscribeAndUnsubscribe_UserIsSubscribed_UserUnsubscribed() {
            User channel = new User();
            User user = User.builder().subscriptions(new HashSet<>(Set.of(channel))).build();

            when(userRepository.findById("1")).thenReturn(Optional.of(user));
            when(userRepository.findById("2")).thenReturn(Optional.of(channel));

            boolean subscribed = userService.subscribeAndUnsubscribe("1", "2");

            assertFalse(subscribed);

            assertThat(user.getSubscriptions()).doesNotContain(channel);
        }
    }

    @Nested
    class FindAll {

        private final Pageable pageable = Pageable.unpaged();

        @Test
        void FindAll_UserAdded_UsersSize() {
            Page<User> users = getUsers(new PageImpl<>(List.of(new User(), new User())));

            assertThat(users).hasSize(2);
        }

        @Test
        void FindAll_NoUserAdded_UsersEmpty() {
            Page<User> users = getUsers(new PageImpl<>(new ArrayList<>()));

            assertThat(users).isEmpty();
        }

        @Test
        void FindAll_PageableIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> userService.findAll(null, null));
        }

        @Test
        void FindAll_NameFilterIsNotNull_UsersSize() {
            when(userRepository.findAllByUsernameContainsIgnoreCase(pageable, "name"))
                    .thenReturn(new PageImpl<>(List.of(new User(), new User())));

            Page<User> users = userService.findAll(pageable, "name");

            assertThat(users).hasSize(2);
        }

        private Page<User> getUsers(PageImpl<User> page) {
            when(userRepository.findAll(pageable)).thenReturn(page);

            return userService.findAll(pageable, null);
        }
    }
}






