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

    private static final long PLAYLIST_ID = 1L;
    private static final long BEAT_ID = 1L;
    private static final String USER_ID = "1";

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
            playlist.setId(PLAYLIST_ID);

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            assertThat(playlistService.findById(PLAYLIST_ID)).isEqualTo(playlist);
        }

        @Test
        void FindById_PlaylistIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> playlistService.findById(PLAYLIST_ID));
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

        when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));
        when(playlistMapper.toDto(playlist)).thenReturn(playlistDto);
        when(userService.findById(USER_ID)).thenReturn(user);

        assertThat(playlistService.findDtoById(PLAYLIST_ID, USER_ID)).isEqualTo(playlistDto);

        playlist.getLikes().add(user);
        playlist.getBeats().add(beat);
        assertThat(playlistService.findDtoById(PLAYLIST_ID, USER_ID)).isEqualTo(playlistDto);

        playlist.getLikes().add(new User());
        playlist.getBeats().add(beat);
        assertThat(playlistService.findDtoById(PLAYLIST_ID, USER_ID)).isEqualTo(playlistDto);
    }

    @Nested
    class FindPageByUserId {

        @Test
        void FindPageByUserId_NoPlaylistAdded_PlaylistsEmpty() {
            when(userService.findById(USER_ID)).thenReturn(new User());

            assertThat(playlistService.findPageByUserId(USER_ID, Pageable.ofSize(1))).isEmpty();
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

            when(userService.findById(USER_ID)).thenReturn(user);

            assertThat(playlistService.findPageByUserId(USER_ID, Pageable.unpaged())).hasSize(2);
        }
    }

    @Nested
    class FindAllByUserId {

        @Test
        void FindAllByUserId_NoPlaylistAdded_PlaylistsEmpty() {
            User user = User.builder().playlists(new ArrayList<>()).build();

            when(userService.findById(USER_ID)).thenReturn(user);

            assertThat(playlistService.findAllByUserId(USER_ID)).isEmpty();
        }

        @Test
        void FindAllByUserId_PlaylistAdded_PlaylistsSize() {
            User user = User.builder().playlists(new ArrayList<>(List.of(new Playlist(), new Playlist()))).build();

            when(userService.findById(USER_ID)).thenReturn(user);

            assertThat(playlistService.findAllByUserId(USER_ID)).hasSize(2);
        }
    }

    @Nested
    class Create {

        @Test
        void Create_PlaylistIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.create(USER_ID, null));
        }

        @Test
        void Create_PlaylistIsNotNull_PlaylistSaved() {
            User user = new User();
            Playlist playlist = new Playlist();

            when(userService.findById(USER_ID)).thenReturn(user);

            playlistService.create(USER_ID, playlist);

            assertThat(playlist.getUser()).isEqualTo(user);

            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Nested
    class Update {

        @Test
        void Update_PlaylistIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> playlistService.update(USER_ID, PLAYLIST_ID, null));
        }

        @Test
        void Update_UsersNotEqual_PlaylistNotSaved() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            playlistService.update("2", PLAYLIST_ID, new Playlist());

            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void Update_UsersEqual_PlaylistSaved() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());
            playlist.setName("name");
            playlist.setDescription("description");
            playlist.setVisibility(true);

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            Playlist updatedPlaylist = new Playlist();
            playlistService.update(USER_ID, PLAYLIST_ID, updatedPlaylist);

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
            playlist.setUser(User.builder().id(USER_ID).build());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            playlistService.delete("2", PLAYLIST_ID);

            verify(playlistRepository, never()).delete(playlist);
        }

        @Test
        void Delete_UsersEqual_PlaylistDeleted() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            playlistService.delete(USER_ID, PLAYLIST_ID);

            verify(playlistRepository, times(1)).delete(playlist);
        }
    }

    @Test
    void uploadImage() throws IOException {
        Playlist playlist = new Playlist();
        playlist.setUser(User.builder().id(USER_ID).build());

        when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

        playlistService.uploadImage(PLAYLIST_ID, new MockMultipartFile("file", new byte[0]));

        assertThat(playlist.getImageName()).isNotNull();
    }

    @Nested
    class AddBeat {

        @Test
        void AddBeat_UsersNotEqual_BeatNotAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            playlistService.addBeat("2", PLAYLIST_ID, BEAT_ID);

            assertThat(playlist.getBeats()).isEmpty();
            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void AddBeat_UsersEqual_BeatAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));
            when(beatService.findById(BEAT_ID)).thenReturn(new Beat());

            playlistService.addBeat(USER_ID, PLAYLIST_ID, BEAT_ID);

            assertThat(playlist.getBeats()).hasSize(1);
            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Nested
    class RemoveBeat {

        @Test
        void RemoveBeat_UsersNotEqual_BeatNotAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());
            playlist.getBeats().add(new Beat());

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

            playlistService.removeBeat("2", PLAYLIST_ID, BEAT_ID);

            assertThat(playlist.getBeats()).hasSize(1);
            verify(playlistRepository, never()).save(playlist);
        }

        @Test
        void RemoveBeat_UsersEqual_BeatAdded() {
            Playlist playlist = new Playlist();
            playlist.setUser(User.builder().id(USER_ID).build());
            Beat beat = new Beat();
            playlist.getBeats().add(beat);

            when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));
            when(beatService.findById(BEAT_ID)).thenReturn(beat);

            playlistService.removeBeat(USER_ID, PLAYLIST_ID, BEAT_ID);

            assertThat(playlist.getBeats()).isEmpty();
            verify(playlistRepository, times(1)).save(playlist);
        }
    }

    @Test
    void addFavorite() {
        User user = new User();
        Playlist playlist = new Playlist();

        when(userService.findById(USER_ID)).thenReturn(user);
        when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

        playlistService.addFavorite(PLAYLIST_ID, USER_ID);

        assertThat(user.getFavoritePlaylists()).contains(playlist);
    }

    @Test
    void removeFavorite() {
        User user = new User();
        Playlist playlist = new Playlist();
        user.getFavoritePlaylists().add(playlist);

        when(userService.findById(USER_ID)).thenReturn(user);
        when(playlistRepository.findById(PLAYLIST_ID)).thenReturn(Optional.of(playlist));

        playlistService.removeFavorite(PLAYLIST_ID, USER_ID);

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
