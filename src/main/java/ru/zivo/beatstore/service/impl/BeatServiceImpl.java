package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.*;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.repository.AudioRepository;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CartRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.impl.common.DeleteAudioFiles;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.BeatDto;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class BeatServiceImpl implements BeatService {

    @Value("${upload.path}")
    private String uploadPath;

    private final BeatRepository beatRepository;

    private final UserRepository userRepository;

    private final AudioRepository audioRepository;

    private final CartRepository cartRepository;

    @Autowired
    public BeatServiceImpl(BeatRepository beatRepository, UserRepository userRepository, AudioRepository audioRepository, CartRepository cartRepository) {
        this.beatRepository = beatRepository;
        this.userRepository = userRepository;
        this.audioRepository = audioRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public Beat create(Long userId, Beat beat) {
        User user = Users.getUser(userId);

        beat.setUser(user);

        Beat savedBeat = beatRepository.save(beat);

        Audio audio = new Audio();
        audio.setBeat(savedBeat);
        audioRepository.save(audio);
        beat.setAudio(audio);

        return beatRepository.save(beat);
    }

    @Override
    public void uploadImage(Long beatId, MultipartFile image) throws IOException {
        Beat beat = findById(beatId);

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats" + "/beat-" + beatId;

        makeDirectory(beat, pathname);

        String imageName = beat.getImageName();

        if (imageName != null) {
            File file = new File(pathname + "/" + imageName);
            file.delete();
        }

        String savedImageName = saveFile(image, pathname);

        beat.setImageName(savedImageName);

        beatRepository.save(beat);
    }

    private void makeDirectory(Beat beat, String pathname) {
        List<File> files = List.of(
                new File(uploadPath),
                new File(uploadPath + "/user-" + beat.getUser().getId()),
                new File(uploadPath + "/user-" + beat.getUser().getId() + "/beats"),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists()) {
                file.mkdir();
            }
        }
    }

    @Override
    public void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException {
        Beat beat = findById(beatId);

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats" + "/beat-" + beatId;

        makeDirectory(beat, pathname);

        Audio audio = beat.getAudio();

        DeleteAudioFiles.delete(beat, pathname);

        String mp3Name = saveFile(mp3, pathname);
        String wavName = saveFile(wav, pathname);
        String zipName = saveFile(zip, pathname);

        audio.setMp3Name(mp3Name);
        audio.setWavName(wavName);
        audio.setTrackStemsName(zipName);

        audioRepository.save(audio);

        beatRepository.save(beat);
    }

    @Override
    public void addTags(Long beatId, List<Tag> tags) {
        Beat beat = findById(beatId);
        beat.setTags(tags);
        beatRepository.save(beat);
    }

    @Override
    public void addLicense(Long beatId, License license) {
        Beat beat = findById(beatId);
        license.setBeat(beat);
        beat.setLicense(license);
        beatRepository.save(beat);
    }

    @Override
    public Beat update(Beat beat) {
        return null;
    }

    @Override
    public Beat findById(Long id) {
        return beatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(id)));
    }

    @Override
    public void addPlay(Long id) {
        Beat beat = findById(id);
        beat.setPlays(beat.getPlays() + 1);
        beatRepository.save(beat);
    }

    @Override
    public void delete(Long id) {
        Beat beat = findById(id);

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats" + "/beat-" + id;

        DeleteAudioFiles.delete(beat, pathname);

        File file = new File(pathname);
        file.delete();

        beatRepository.delete(beat);
    }

    @Override
    public List<Beat> getTrendBeats(Integer limit) {
        List<Beat> beats = beatRepository.findAll();

        List<Beat> publishedBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(beat);
            }
        }

        return publishedBeats.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public void addAndDeleteFavorite(Long beatId, Long userId) {
        User user = Users.getUser(userId);
        Beat byId = findById(beatId);

        for (Beat beat : user.getFavoriteBeats()) {
            if (beat == byId) {
                user.getFavoriteBeats().remove(beat);
                userRepository.save(user);
                return;
            }
        }

        user.getFavoriteBeats().add(byId);

        userRepository.save(user);
    }

    private String saveFile(MultipartFile file, String pathname) throws IOException {
        if (file == null) {
            return null;
        }

        String resultFilename = UUID.randomUUID().toString();

        file.transferTo(new File(pathname + "/" + resultFilename));

        return resultFilename;
    }

    @Override
    public Cart addToCart(Long userId, Long beatId, String license) {
        User user = Users.getUser(userId);
        Beat beat = findById(beatId);

        if (!cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.valueOf(license))) {

            Optional<Cart> cartRepositoryByBeatAndUser = cartRepository.findByBeatAndUser(beat, user);
            if (cartRepositoryByBeatAndUser.isEmpty()) {
                Cart cart = Cart.builder()
                        .user(user)
                        .beat(beat)
                        .licensing(Licensing.valueOf(license))
                        .build();

                Cart savedCart = cartRepository.save(cart);

                user.getCart().add(savedCart);

                userRepository.save(user);

                return savedCart;
            } else {
                cartRepositoryByBeatAndUser.get().setLicensing(Licensing.valueOf(license));

                Cart savedCart = cartRepository.save(cartRepositoryByBeatAndUser.get());

                user.getCart().add(savedCart);

                userRepository.save(user);

                return savedCart;
            }


        }
        return null;
    }

    @Override
    public void addToHistory(Long userId, Long beatId) {
        User user = Users.getUser(userId);
        Beat beat = findById(beatId);

        List<Beat> history = user.getHistory();

        for (Beat historyBeat : history) {
            if (historyBeat == beat) {
                return;
            }
        }

        history.add(beat);

        userRepository.save(user);
    }

    @Override
    public Page<BeatDto> getTopChart(
            String nameFilter,
            Long tag,
            String genre,
            Integer priceMin,
            Integer priceMax,
            String key,
            String mood,
            Integer bpmMin,
            Integer bpmMax,
            Long userId,
            Pageable pageable
    ) {

        List<Beat> beats = beatRepository.findAll();
        User user = null;
        if (userId != null) {
            user = Users.getUser(userId);
        }

        List<Beat> publishedBeats = sortedPublishedBeats(beats);

        List<Beat> sortedBeats = publishedBeats.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .toList();

        if (nameFilter == null
            && tag == null
            && genre == null
            && priceMin == null
            && priceMax == null
            && key == null
            && mood == null
            && bpmMin == null
            && bpmMax == null
        ) {
            List<BeatDto> beatDtoList = getDtoList(user, sortedBeats);

            return listToPage(pageable, beatDtoList);
        }

        List<Beat> filteredBeats = new ArrayList<>();

        if (nameFilter != null) {
            filteredBeats = beatRepository.findAllByTitleContainsIgnoreCase(nameFilter);
        }

        for (Beat sortedBeat : sortedBeats) {

            boolean add = true;

            if (tag != null) {
                boolean addTag = false;
                List<Tag> beatTags = sortedBeat.getTags();
                for (Tag beatTag : beatTags) {
                    if (Objects.equals(beatTag.getId(), tag)) {
                        addTag = true;
                        break;
                    }
                }
                if (!addTag) {
                    add = false;
                }
            }

            if (add) {
                if (genre != null) {
                    if (!sortedBeat.getGenre().name().equals(genre)) {
                        add = false;
                    }
                }
            }

            if (add) {
                if (priceMin != null && priceMax != null) {
                    if (sortedBeat.getLicense().getPrice_mp3() < priceMin
                        || sortedBeat.getLicense().getPrice_mp3() > priceMax
                    ) {
                        add = false;
                    }
                }
            }

            if (add) {
                if (key != null) {
                    if (!sortedBeat.getKey().name().equals(key)) {
                        add = false;
                    }
                }
            }

            if (add) {
                if (mood != null) {
                    if (!sortedBeat.getMood().name().equals(mood)) {
                        add = false;
                    }
                }
            }

            if (add) {
                if (bpmMin != null && bpmMax != null) {
                    if (sortedBeat.getBpm() < bpmMin || sortedBeat.getBpm() > bpmMax) {
                        add = false;
                    }
                }
            }

            if (add ) {
                filteredBeats.add(sortedBeat);
            }
        }

        List<BeatDto> beatDtoList = getDtoList(user, filteredBeats);

        return listToPage(pageable, beatDtoList);
    }

    @Override
    public Page<BeatDto> getHistoryBeats(Long userId, Pageable pageable) {
        User user = Users.getUser(userId);

        List<Beat> history = user.getHistory();

        List<Beat> publishedBeats = sortedPublishedBeats(history);

        List<BeatDto> dtoList = getDtoList(user, publishedBeats);

        return listToPage(pageable, dtoList);
    }

    @Override
    public Page<BeatDto> getFavoriteBeats(Long userId, Pageable pageable) {
        User user = Users.getUser(userId);

        List<Beat> history = user.getFavoriteBeats();

        List<Beat> publishedBeats = sortedPublishedBeats(history);

        List<BeatDto> dtoList = getDtoList(user, publishedBeats);

        return listToPage(pageable, dtoList);
    }

    @Override
    public Page<BeatDto> getBeats(Long userId, Long authUserId, Pageable pageable) {
        List<Beat> history = Users.getUser(userId).getBeats();

        List<Beat> publishedBeats = sortedPublishedBeats(history);

        User authUser = null;

        if (authUserId != null) {
            authUser = Users.getUser(authUserId);
        }

        List<BeatDto> dtoList = getDtoList(authUser, publishedBeats);

        return listToPage(pageable, dtoList);
    }

    public List<Beat> sortedPublishedBeats(List<Beat> beats) {
        List<Beat> publishedBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(beat);
            }
        }

        return publishedBeats;
    }

    private PageImpl<BeatDto> listToPage(Pageable pageable, List<BeatDto> beatDtoList) {
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), beatDtoList.size());
        return new PageImpl<>(beatDtoList.subList(start, end), pageable, beatDtoList.size());
    }

    private List<BeatDto> getDtoList(User user, List<Beat> sortedBeats) {
        List<BeatDto> beatDtoList = new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {

            BeatDto beatDto = BeatDto.builder()
                    .beat(sortedBeat)
                    .addedToCart(false)
                    .build();

            if (user != null) {
                for (Cart cart : user.getCart()) {
                    if (cart.getBeat() == sortedBeat) {
                        beatDto.setAddedToCart(true);
                    }
                }
            }

            beatDtoList.add(beatDto);
        }

        return beatDtoList;
    }
}
