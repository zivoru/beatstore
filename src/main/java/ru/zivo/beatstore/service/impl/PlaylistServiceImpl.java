package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.PlaylistRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;

    @Autowired
    public PlaylistServiceImpl(PlaylistRepository playlistRepository, UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Playlist findById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Плейлист с id = %d не найден".formatted(id)));
    }

    @Override
    public List<PlaylistDto> getRecommended(Integer limit) {

        List<Playlist> playlists = playlistRepository.findAll();

        List<Playlist> publishedPlaylists = new ArrayList<>();

        for (Playlist playlist : playlists) {
            if (playlist.getVisibility()) {
                publishedPlaylists.add(playlist);
            }
        }

        List<Playlist> sortedPlaylists = publishedPlaylists.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getLikes().size(), o1.getLikes().size()))
                .limit(limit).toList();

        List<PlaylistDto> playlistDtoList = new ArrayList<>();

        for (Playlist playlist : sortedPlaylists) {
            PlaylistDto playlistDto = PlaylistDto.builder()
                    .id(playlist.getId())
                    .name(playlist.getName())
                    .imageName(playlist.getImageName())
                    .description(playlist.getDescription())
                    .visibility(playlist.getVisibility())
                    .user(playlist.getUser())
                    .beats(playlist.getBeats())
                    .likes(playlist.getLikes())
                    .build();

            int countBeats = playlist.getBeats().size();

            if ((countBeats % 10 == 1) && (countBeats % 100 != 11)) {
                playlistDto.setBeatCount(countBeats + " Бит");
            } else if ((countBeats % 10 >= 2 && countBeats % 10 <= 4) && !(countBeats % 100 >= 12 && countBeats % 100 <= 14)) {
                playlistDto.setBeatCount(countBeats + " Бита");
            } else {
                playlistDto.setBeatCount(countBeats + " Битов");
            }

            int countLikes = playlist.getLikes().size();

            if ((countLikes % 10 == 1) && (countLikes % 100 != 11)) {
                playlistDto.setLikesCount(countLikes + " Лайк");
            } else if ((countLikes % 10 >= 2 && countLikes % 10 <= 4) && !(countLikes % 100 >= 12 && countLikes % 100 <= 14)) {
                playlistDto.setLikesCount(countLikes + " Лайка");
            } else {
                playlistDto.setLikesCount(countLikes + " Лайков");
            }

            playlistDtoList.add(playlistDto);
        }

        return playlistDtoList;
    }

    @Override
    public void addAndDeleteFavorite(Long playlistId, Long userId) {
        User user = Users.getUser(userId);
        Playlist playlist = findById(playlistId);

        for (Playlist favoritePlaylist : user.getFavoritePlaylists()) {
            if (favoritePlaylist == playlist) {
                user.getFavoritePlaylists().remove(playlist);
                userRepository.save(user);
                return;
            }
        }

        user.getFavoritePlaylists().add(playlist);

        userRepository.save(user);
    }
}
