package ru.zivo.beatstore.repository;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.zivo.beatstore.annotation.IT;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@IT
@RequiredArgsConstructor
class PlaylistRepositoryTest {

    private final UserRepository userRepository;
    private final PlaylistRepository playlistRepository;

    private User user;

    @BeforeEach
    void saveUser() {
        user = userRepository.save(User.builder()
                .id("1")
                .email("email")
                .username("name")
                .verified(false)
                .status(Status.ACTIVE)
                .build());
    }

    @Test
    void findAllByNameContainsIgnoreCase() {
        Playlist playlist1 = ofName("Drake Type Beats");
        Playlist playlist2 = ofName("Playboi Carti type beats");
        Playlist playlist3 = ofName("DRAKE TYPE BEATS");
        Playlist playlist4 = ofName("Hip-Hop");

        playlistRepository.saveAll(List.of(playlist1, playlist2, playlist3, playlist4));

        List<Playlist> playlists = playlistRepository.findAllByNameContainsIgnoreCase("type beAtS");

        assertThat(playlists)
                .hasSize(3)
                .contains(playlist1, playlist2, playlist3)
                .doesNotContain(playlist4);
    }

    @NotNull
    private Playlist ofName(String name) {
        return new Playlist(name, null, null, true, user, new ArrayList<>(), new HashSet<>());
    }
}