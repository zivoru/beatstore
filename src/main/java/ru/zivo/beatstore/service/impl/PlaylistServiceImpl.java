package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.PlaylistRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.PlaylistService;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.BeatDto;
import ru.zivo.beatstore.web.dto.PlaylistDto;

import java.io.File;
import java.io.IOException;
import java.util.*;

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
    public PlaylistDto findDtoById(Long playlistId, String userId) {
        return mapToDto(findById(playlistId), Users.getUser(userId));
    }

    @Override
    public List<Playlist> findAllByUserId(String userId) {
        List<Playlist> playlists = Users.getUser(userId).getPlaylists();
        Collections.reverse(playlists);
        return playlists;
    }

    @Override
    public Page<PlaylistDto> findPageByUserId(String userId, Pageable pageable) {
        List<Playlist> playlists = Users.getUser(userId).getPlaylists();
        List<Playlist> publishedPlaylists = sortByVisibility(playlists);
        List<PlaylistDto> playlistDtoList = mapToDtoList(publishedPlaylists);

        Collections.reverse(playlistDtoList);

        return mapToPage(pageable, playlistDtoList);
    }

    private PageImpl<PlaylistDto> mapToPage(Pageable pageable, List<PlaylistDto> playlistDtoList) {
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), playlistDtoList.size());
        return new PageImpl<>(playlistDtoList.subList(start, end), pageable, playlistDtoList.size());
    }

    private List<PlaylistDto> mapToDtoList(List<Playlist> publishedPlaylists) {
        List<PlaylistDto> playlistDtoList = new ArrayList<>();

        for (Playlist playlist : publishedPlaylists) {
            playlistDtoList.add(mapToDto(playlist, null));
        }
        return playlistDtoList;
    }

    private List<Playlist> sortByVisibility(List<Playlist> playlists) {
        List<Playlist> publishedPlaylists = new ArrayList<>();

        for (Playlist playlist : playlists) {
            if (playlist.getVisibility()) publishedPlaylists.add(playlist);
        }
        return publishedPlaylists;
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
    public Page<PlaylistDto> findAll(Pageable pageable, String nameFilter) {
        List<Playlist> playlists = nameFilter != null
                ? playlistRepository.findAllByNameContainsIgnoreCase(nameFilter)
                : playlistRepository.findAll();
        List<Playlist> publishedPlaylists = sortByVisibility(playlists);
        List<PlaylistDto> playlistDtoList = mapToDtoList(publishedPlaylists);

        return mapToPage(pageable, playlistDtoList);
    }

    private PlaylistDto mapToDto(Playlist playlist, User user) {

        List<Beat> beats = playlist.getBeats();
        List<BeatDto> beatDtoList = new ArrayList<>();
        Map<Long, Integer> beatsInCart = new HashMap<>();

        if (user != null) {
            for (Cart cart : user.getCart()) {
                beatsInCart.put(cart.getBeat().getId(), 1);
            }
        }

        for (Beat beat : beats) {
            BeatDto beatDto = BeatDto.builder()
                    .beat(beat)
                    .addedToCart(false)
                    .build();

            if (user != null) {
                if (beatsInCart.get(beat.getId()) != null) beatDto.setAddedToCart(true);
            }

            beatDtoList.add(beatDto);
        }

        PlaylistDto playlistDto = PlaylistDto.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .imageName(playlist.getImageName())
                .description(playlist.getDescription())
                .visibility(playlist.getVisibility())
                .user(playlist.getUser())
                .beats(beatDtoList)
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
