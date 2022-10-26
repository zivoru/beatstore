package ru.zivo.beatstore.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.PlaylistRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.service.impl.common.DeleteFiles;
import ru.zivo.beatstore.web.dto.DisplayBeatDto;
import ru.zivo.beatstore.web.dto.PlaylistDto;
import ru.zivo.beatstore.web.mapper.PlaylistMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.*;

@Slf4j
@Service
public class PlaylistServiceImpl implements PlaylistService {
    private static final String PREFIX_USER = "/user-";

    private final String uploadPath;

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final PlaylistMapper playlistMapper;
    private final UserService userService;
    private final BeatService beatService;

    @Autowired
    public PlaylistServiceImpl(PlaylistRepository playlistRepository, UserRepository userRepository,
                               BeatstoreProperties beatstoreProperties, PlaylistMapper playlistMapper,
                               UserService userService, BeatService beatService) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
        this.uploadPath = beatstoreProperties.getUploadPath();
        this.playlistMapper = playlistMapper;
        this.userService = userService;
        this.beatService = beatService;
    }

    @Override
    public Playlist findById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Плейлист с id = %d не найден".formatted(id)));
    }

    @Override
    public PlaylistDto findDtoById(Long playlistId, String userId) {
        return mapToDto(findById(playlistId), userId != null ? userService.findById(userId) : null);
    }

    @Override
    public List<Playlist> findAllByUserId(String userId) {
        return userService.findById(userId).getPlaylists();
    }

    @Override
    public Page<PlaylistDto> findPageByUserId(String userId, Pageable pageable) {
        List<Playlist> playlists = userService.findById(userId).getPlaylists();
        List<Playlist> publishedPlaylists = sortByVisibility(playlists);
        List<PlaylistDto> playlistDtoList = mapToDtoList(publishedPlaylists);

        return mapToPage(pageable, playlistDtoList);
    }

    private List<PlaylistDto> mapToDtoList(List<Playlist> publishedPlaylists) {
        return publishedPlaylists.stream()
                .map(playlist -> mapToDto(playlist, null))
                .toList();
    }

    private List<Playlist> sortByVisibility(List<Playlist> playlists) {
        return playlists.stream()
                .filter(playlist -> playlist.getVisibility() != null)
                .filter(Playlist::getVisibility)
                .toList();
    }

    @Override
    public Playlist create(String userId, Playlist playlist) {
        if (playlist == null) {
            throw new IllegalArgumentException("playlist is null");
        }
        playlist.setUser(userService.findById(userId));
        return playlistRepository.save(playlist);
    }

    @Override
    public void update(String userId, Long playlistId, Playlist playlist) {
        if (playlist == null) {
            throw new IllegalArgumentException("playlist is null");
        }

        Playlist playlistById = findById(playlistId);

        if (!playlistById.getUser().getId().equals(userId)) {
            return;
        }

        playlistById.setName(playlist.getName());
        playlistById.setDescription(playlist.getDescription());
        playlistById.setVisibility(playlist.getVisibility());
        playlistRepository.save(playlistById);
    }

    @Override
    public void delete(String userId, Long playlistId) {
        Playlist playlist = findById(playlistId);

        if (playlist.getUser().getId().equals(userId)) {
            if (playlist.getImageName() != null && !Objects.equals(playlist.getImageName(), "")) {
                String pathname = uploadPath + PREFIX_USER + playlist.getUser().getId()
                                  + "/playlists/playlist-" + playlist.getId();

                DeleteFiles.deleteFile(Path.of(pathname, playlist.getImageName()));
                DeleteFiles.deleteFile(Path.of(pathname));
            }
            playlistRepository.delete(playlist);
        }
    }

    @Override
    public void uploadImage(Long id, MultipartFile image) throws IOException {
        Playlist playlist = findById(id);
        String path = uploadPath == null ? "" : uploadPath;
        String pathname = path + PREFIX_USER + playlist.getUser().getId() + "/playlists/playlist-" + id;
        List<File> files = List.of(
                new File(path),
                new File(path + PREFIX_USER + playlist.getUser().getId()),
                new File(path + PREFIX_USER + playlist.getUser().getId() + "/playlists"),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists() && !file.mkdir()) {
                log.info("Не удалось создать файл: {}", file.getName());
            }
        }

        String imageName = playlist.getImageName();
        if (imageName != null && !imageName.equals("")) {
            DeleteFiles.deleteFile(Path.of(pathname, imageName));
        }

        if (image == null) {
            return;
        }

        String resultFilename = UUID.randomUUID() + ".jpg";
        image.transferTo(new File("%s/%s".formatted(pathname, resultFilename)));
        playlist.setImageName(resultFilename);

        playlistRepository.save(playlist);
    }

    @Override
    public void addBeat(String userId, Long playlistId, Long beatId) {
        Playlist playlist = findById(playlistId);

        if (!playlist.getUser().getId().equals(userId)) {
            return;
        }

        playlist.getBeats().add(beatService.findById(beatId));
        playlistRepository.save(playlist);
    }

    @Override
    public void removeBeat(String userId, Long playlistId, Long beatId) {
        Playlist playlist = findById(playlistId);

        if (!playlist.getUser().getId().equals(userId)) {
            return;
        }

        playlist.getBeats().remove(beatService.findById(beatId));
        playlistRepository.save(playlist);
    }

    @Override
    public void addFavorite(Long playlistId, String userId) {
        User user = userService.findById(userId);
        user.getFavoritePlaylists().add(findById(playlistId));
        userRepository.save(user);
    }

    @Override
    public void removeFavorite(Long playlistId, String userId) {
        User user = userService.findById(userId);
        user.getFavoritePlaylists().remove(findById(playlistId));
        userRepository.save(user);
    }

    @Override
    public Page<PlaylistDto> findAll(Pageable pageable, String nameFilter) {
        if (pageable == null) {
            throw new IllegalArgumentException("pageable is null");
        }
        List<Playlist> playlists = nameFilter != null
                ? playlistRepository.findAllByNameContainsIgnoreCase(nameFilter)
                : playlistRepository.findAll();
        List<Playlist> publishedPlaylists = sortByVisibility(playlists);
        List<PlaylistDto> playlistDtoList = mapToDtoList(publishedPlaylists);

        return mapToPage(pageable, playlistDtoList);
    }

    private Page<PlaylistDto> mapToPage(Pageable pageable, List<PlaylistDto> playlistDtoList) {
        if (pageable == Pageable.unpaged()) {
            return new PageImpl<>(playlistDtoList);
        }
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), playlistDtoList.size());
        return new PageImpl<>(playlistDtoList.subList(start, end), pageable, playlistDtoList.size());
    }

    private PlaylistDto mapToDto(Playlist playlist, User user) {
        List<DisplayBeatDto> displayBeatDtoList = new ArrayList<>();
        Set<Long> beatsInCart = new HashSet<>();

        if (user != null) {
            for (Cart cart : user.getCart()) {
                beatsInCart.add(cart.getBeat().getId());
            }
        }

        for (Beat beat : playlist.getBeats()) {
            DisplayBeatDto displayBeatDto = DisplayBeatDto.builder()
                    .beat(beat)
                    .addedToCart(false)
                    .build();

            if (user != null && beatsInCart.contains(beat.getId())) {
                displayBeatDto.setAddedToCart(true);
            }

            displayBeatDtoList.add(displayBeatDto);
        }

        PlaylistDto playlistDto = playlistMapper.toDto(playlist);

        playlistDto.setBeats(displayBeatDtoList);

        setBeatCount(playlist, playlistDto);

        setLikesCount(playlist, playlistDto);

        return playlistDto;
    }

    private void setLikesCount(Playlist playlist, PlaylistDto playlistDto) {
        int countLikes = playlist.getLikes().size();

        if ((countLikes % 10 == 1) && (countLikes % 100 != 11)) {
            playlistDto.setLikesCount(countLikes + " Лайк");
        } else if ((countLikes % 10 >= 2 && countLikes % 10 <= 4) && !(countLikes % 100 >= 12 && countLikes % 100 <= 14)) {
            playlistDto.setLikesCount(countLikes + " Лайка");
        } else {
            playlistDto.setLikesCount(countLikes + " Лайков");
        }
    }

    private void setBeatCount(Playlist playlist, PlaylistDto playlistDto) {
        int countBeats = playlist.getBeats().size();

        if ((countBeats % 10 == 1) && (countBeats % 100 != 11)) {
            playlistDto.setBeatCount(countBeats + " Бит");
        } else if ((countBeats % 10 >= 2 && countBeats % 10 <= 4) && !(countBeats % 100 >= 12 && countBeats % 100 <= 14)) {
            playlistDto.setBeatCount(countBeats + " Бита");
        } else {
            playlistDto.setBeatCount(countBeats + " Битов");
        }
    }
}
