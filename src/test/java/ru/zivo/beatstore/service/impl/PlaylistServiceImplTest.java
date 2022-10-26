package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.PlaylistRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.PlaylistDto;
import ru.zivo.beatstore.web.mapper.PlaylistMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaylistServiceImplTest {

    @Mock
    private BeatstoreProperties beatstoreProperties;

    @Mock
    private PlaylistRepository playlistRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BeatRepository beatRepository;

    @Mock
    private PlaylistMapper playlistMapper;

    @Mock
    private UserService userService;

    @Mock
    private BeatService beatService;

    @InjectMocks
    private PlaylistServiceImpl playlistService;

    @Nested
    class FindById {

        @Test
        void FindById_PlaylistIsFound_ReturnPlaylist() {
            Playlist playlist = new Playlist();
            playlist.setId(1L);

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            assertThat(playlistService.findById(1L)).isEqualTo(playlist);
        }

        @Test
        void FindById_PlaylistIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> playlistService.findById(-1L));
        }

        @Test
        void FindById_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.findById(null));
        }
    }

    @Test
    void FindDtoById_PlaylistIsFound_ReturnPlaylist() {
        User user = new User();
        Beat beat = new Beat();
        Cart cart = new Cart(Licensing.EXCLUSIVE, user, beat);
        user.setCart(new ArrayList<>(List.of(cart)));
        Playlist playlist = new Playlist();
        playlist.setBeats(new ArrayList<>(List.of(beat)));
        PlaylistDto playlistDto = new PlaylistDto();

        when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));
        when(playlistMapper.toDto(playlist)).thenReturn(playlistDto);
        when(userService.findById("1")).thenReturn(user);

        assertThat(playlistService.findDtoById(1L, "1")).isEqualTo(playlistDto);

        playlist.getLikes().add(user);
        playlist.getBeats().add(beat);
        assertThat(playlistService.findDtoById(1L, "1")).isEqualTo(playlistDto);

        playlist.getLikes().add(new User());
        playlist.getBeats().add(beat);
        assertThat(playlistService.findDtoById(1L, "1")).isEqualTo(playlistDto);
    }

    @Nested
    class FindPageByUserId {

        @Test
        void FindPageByUserId_NoPlaylistAdded_PlaylistsEmpty() {
            when(userService.findById("1")).thenReturn(new User());

            assertThat(playlistService.findPageByUserId("1", Pageable.ofSize(1))).isEmpty();
        }

        @Test
        void FindPageByUserId_PlaylistAdded_PlaylistsSize() {
            Playlist playlist1 = new Playlist();
            Playlist playlist2 = new Playlist();
            playlist1.setVisibility(true);
            playlist2.setVisibility(true);

            User user = User.builder().playlists(new ArrayList<>(List.of(playlist1, playlist2))).build();

            when(playlistMapper.toDto(playlist1))
                    .thenReturn(PlaylistDto.builder().visibility(playlist1.getVisibility()).build());

            when(playlistMapper.toDto(playlist2))
                    .thenReturn(PlaylistDto.builder().visibility(playlist2.getVisibility()).build());

            when(userService.findById("1")).thenReturn(user);

            assertThat(playlistService.findPageByUserId("1", Pageable.unpaged())).hasSize(2);
        }
    }

    @Nested
    class FindAllByUserId {

        @Test
        void FindAllByUserId_NoPlaylistAdded_PlaylistsEmpty() {
            User user = User.builder().playlists(new ArrayList<>()).build();

            when(userService.findById("1")).thenReturn(user);

            assertThat(playlistService.findAllByUserId("1")).isEmpty();
        }

        @Test
        void FindAllByUserId_PlaylistAdded_PlaylistsSize() {
            User user = User.builder().playlists(new ArrayList<>(List.of(new Playlist(), new Playlist()))).build();

            when(userService.findById("1")).thenReturn(user);

            assertThat(playlistService.findAllByUserId("1")).hasSize(2);
        }
    }

    @Nested
    class Create {

        @Test
        void Create_PlaylistIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.create("1", null));
        }

        @Test
        void Create_PlaylistIsNotNull_PlaylistSaved() {
            User user = new User();
            Playlist playlist = new Playlist();

            when(userService.findById("1")).thenReturn(user);

            playlistService.create("1", playlist);

            assertThat(playlist.getUser()).isEqualTo(user);

            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Nested
    class Update {

        @Test
        void Update_PlaylistIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.update("1", 1L, null));
        }

        @Test
        void Update_UsersNotEqual_PlaylistNotSaved() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            playlistService.update("2", 1L, new Playlist());

            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void Update_UsersEqual_PlaylistSaved() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());
            playlist.setName("name");
            playlist.setDescription("description");
            playlist.setVisibility(true);

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            Playlist updatedPlaylist = new Playlist();
            playlistService.update("1", 1L, updatedPlaylist);

            verify(playlistRepository, times(1)).save(playlist);

            assertEquals(playlist.getName(), updatedPlaylist.getName());
            assertEquals(playlist.getDescription(), updatedPlaylist.getDescription());
            assertEquals(playlist.getVisibility(), updatedPlaylist.getVisibility());
        }
    }

    @Nested
    class Delete {

        @Test
        void Delete_UsersNotEqual_PlaylistNotDeleted() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            playlistService.delete("2", 1L);

            verify(playlistRepository, never()).delete(playlist);
        }

        @Test
        void Delete_UsersEqual_PlaylistDeleted() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            playlistService.delete("1", 1L);

            verify(playlistRepository, times(1)).delete(playlist);
        }
    }

    @Test
    void uploadImage() throws IOException {
        Playlist playlist = new Playlist();
        playlist.setUser(User.builder().id("1").build());

        when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

        playlistService.uploadImage(1L, new MockMultipartFile("file", new byte[0]));

        assertThat(playlist.getImageName()).isNotNull();
    }

    @Nested
    class AddBeat {

        @Test
        void AddBeat_UsersNotEqual_BeatNotAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            playlistService.addBeat("2", 1L, 1L);

            assertThat(playlist.getBeats()).isEmpty();
            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void AddBeat_UsersEqual_BeatAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));
            when(beatService.findById(1L)).thenReturn(new Beat());

            playlistService.addBeat("1", 1L, 1L);

            assertThat(playlist.getBeats()).hasSize(1);
            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Nested
    class RemoveBeat {

        @Test
        void RemoveBeat_UsersNotEqual_BeatNotAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());
            playlist.getBeats().add(new Beat());

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

            playlistService.removeBeat("2", 1L, 1L);

            assertThat(playlist.getBeats()).hasSize(1);
            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void RemoveBeat_UsersEqual_BeatAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id("1").build());
            Beat beat = new Beat();
            playlist.getBeats().add(beat);

            when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));
            when(beatService.findById(1L)).thenReturn(beat);

            playlistService.removeBeat("1", 1L, 1L);

            assertThat(playlist.getBeats()).isEmpty();
            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Test
    void addFavorite() {
        User user = new User();
        Playlist playlist = new Playlist();

        when(userService.findById("1")).thenReturn(user);
        when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

        playlistService.addFavorite(1L, "1");

        assertThat(user.getFavoritePlaylists()).contains(playlist);
    }

    @Test
    void removeFavorite() {
        User user = new User();
        Playlist playlist = new Playlist();
        user.getFavoritePlaylists().add(playlist);

        when(userService.findById("1")).thenReturn(user);
        when(playlistRepository.findById(1L)).thenReturn(Optional.of(playlist));

        playlistService.removeFavorite(1L, "1");

        assertThat(user.getFavoritePlaylists()).isEmpty();
    }

    @Nested
    class FindAll {

        private final Pageable pageable = Pageable.unpaged();

        @Test
        void FindAll_PlaylistAdded_PlaylistsSize() {
            Playlist playlist1 = new Playlist();
            Playlist playlist2 = new Playlist();

            playlist1.setVisibility(true);
            playlist2.setVisibility(true);

            when(playlistMapper.toDto(playlist1))
                    .thenReturn(PlaylistDto.builder().visibility(playlist1.getVisibility()).build());

            when(playlistMapper.toDto(playlist2))
                    .thenReturn(PlaylistDto.builder().visibility(playlist2.getVisibility()).build());

            Page<PlaylistDto> playlists = getPlaylists(new ArrayList<>(List.of(playlist1, playlist2)));

            assertThat(playlists).hasSize(2);
        }

        @Test
        void FindAll_NoPlaylistAdded_PlaylistsEmpty() {
            Page<PlaylistDto> playlists = getPlaylists(new ArrayList<>());

            assertThat(playlists).isEmpty();
        }

        @Test
        void FindAll_PageableIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.findAll(null, null));
        }

        @Test
        void FindAll_NameFilterIsNotNull_PlaylistsSize() {
            Playlist playlist1 = new Playlist();
            playlist1.setVisibility(true);

            when(playlistMapper.toDto(playlist1))
                    .thenReturn(PlaylistDto.builder().visibility(playlist1.getVisibility()).build());

            when(playlistRepository.findAllByNameContainsIgnoreCase("name"))
                    .thenReturn(List.of(playlist1));

            Page<PlaylistDto> playlists = playlistService.findAll(pageable, "name");

            assertThat(playlists).hasSize(1);
        }

        private Page<PlaylistDto> getPlaylists(List<Playlist> list) {
            when(playlistRepository.findAll()).thenReturn(list);

            return playlistService.findAll(pageable, null);
        }
    }
}
