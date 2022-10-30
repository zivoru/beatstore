package ru.zivo.beatstore.repository;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.annotation.IT;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@IT
@RequiredArgsConstructor
class UserRepositoryTest {

    private final UserRepository userRepository;

    @Test
    void findByUsername() {
        User user = saveUser("1", "email", "ivan");

        Optional<User> foundUser = userRepository.findByUsername("ivan");

        assertThat(foundUser).isNotEmpty();
        assertThat(foundUser.get()).isEqualTo(user);

        assertThat(userRepository.findByUsername("stepan")).isEmpty();
    }

    @Test
    void findAllByUsernameContainsIgnoreCase() {
        User user1 = saveUser("1", "email1", "ivan");
        User user2 = saveUser("2", "email2", "igor");
        User user3 = saveUser("3", "email3", "stepAn");
        User user4 = saveUser("4", "email4", "kolya");

        Page<User> users = userRepository.findAllByUsernameContainsIgnoreCase(Pageable.unpaged(), "AN");

        assertThat(users)
                .hasSize(2)
                .contains(user1, user3)
                .doesNotContain(user2, user4);
    }

    @NotNull
    private User saveUser(String id, String email, String username) {
        return userRepository.save(User.builder()
                .id(id)
                .email(email)
                .username(username)
                .verified(false)
                .status(Status.ACTIVE)
                .build());
    }
}