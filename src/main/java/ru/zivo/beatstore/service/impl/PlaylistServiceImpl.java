package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.PlaylistRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    @Value("${upload.path}")
    private String uploadPath;

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final BeatRepository beatRepository;

    @Autowired
    public PlaylistServiceImpl(PlaylistRepository playlistRepository, UserRepository userRepository, BeatRepository beatRepository) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
        this.beatRepository = beatRepository;
    }

    @Override
    public Playlist findById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Плейлист с id = %d не найден".formatted(id)));
    }

    @Override
    public PlaylistDto findDtoById(Long id) {
        return mapToDto(findById(id));
    }

    @Override
    public List<Playlist> findAllByUserId(String userId) {
        return Users.getUser(userId).getPlaylists();
    }

    @Override
    public Playlist create(String userId, Playlist playlist) {
        playlist.setUser(Users.getUser(userId));
        return playlistRepository.save(playlist);
    }

    @Override
    public void update(String userId, Long playlistId, Playlist playlist) {
        Playlist playlistById = findById(playlistId);

        if (!playlistById.getUser().getId().equals(userId)) return;

        playlistById.setName(playlist.getName());
        playlistById.setDescription(playlist.getDescription());
        playlistById.setVisibility(playlist.getVisibility());
        playlistRepository.save(playlistById);
    }

    @Override
    public void delete(String userId, Long playlistId) {
        Playlist playlist = findById(playlistId);

        if (playlist.getUser().getId().equals(userId)) playlistRepository.delete(playlist);
    }

    @Override
    public void uploadImage(Long id, MultipartFile image) throws IOException {
        Playlist playlist = findById(id);
        String pathname = uploadPath + "/user-" + playlist.getUser().getId() + "/playlists/playlist-" + id;
        List<File> files = List.of(
                new File(uploadPath),
                new File(uploadPath + "/user-" + playlist.getUser().getId()),
                new File(uploadPath + "/user-" + playlist.getUser().getId() + "/playlists"),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists()) {
                boolean mkdir = file.mkdir();
                System.out.println(mkdir);
            }
        }

        String imageName = playlist.getImageName();
        if (imageName != null && !imageName.equals("")) {
            System.out.println(new File(pathname + "/" + imageName).delete());
        }

        if (image == null) return;

        String resultFilename = UUID.randomUUID() + ".jpg";
        image.transferTo(new File(pathname + "/" + resultFilename));
        playlist.setImageName(resultFilename);

        playlistRepository.save(playlist);
    }

    @Override
    public void addBeat(String userId, Long playlistId, Long beatId) {
        Playlist playlist = findById(playlistId);

        if (!playlist.getUser().getId().equals(userId)) return;

        playlist.getBeats().add(getBeat(beatId));
        playlistRepository.save(playlist);
    }

    @Override
    public void removeBeat(String userId, Long playlistId, Long beatId) {
        Playlist playlist = findById(playlistId);

        if (!playlist.getUser().getId().equals(userId)) return;

        playlist.getBeats().remove(getBeat(beatId));
        playlistRepository.save(playlist);
    }

    @Override
    public void addFavorite(Long playlistId, String userId) {
        User user = Users.getUser(userId);
        user.getFavoritePlaylists().add(findById(playlistId));
        userRepository.save(user);
    }

    @Override
    public void removeFavorite(Long playlistId, String userId) {
        User user = Users.getUser(userId);
        user.getFavoritePlaylists().remove(findById(playlistId));
        userRepository.save(user);
    }

    @Override
    public List<PlaylistDto> getRecommended(Integer limit) {
        List<Playlist> publishedPlaylists = new ArrayList<>();

        for (Playlist playlist : playlistRepository.findAll()) {
            if (playlist.getVisibility()) publishedPlaylists.add(playlist);
        }

        List<Playlist> sortedPlaylists = publishedPlaylists.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getLikes().size(), o1.getLikes().size()))
                .limit(limit).toList();

        List<PlaylistDto> playlistDtoList = new ArrayList<>();

        for (Playlist playlist : sortedPlaylists) {
            playlistDtoList.add(mapToDto(playlist));
        }

        return playlistDtoList;
    }

    private PlaylistDto mapToDto(Playlist playlist) {
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

        return playlistDto;
    }

    private Beat getBeat(Long beatId) {
        return beatRepository.findById(beatId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(beatId)));
    }
}
