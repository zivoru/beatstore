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
import ru.zivo.beatstore.web.dto.CartDto;

import java.io.File;
import java.io.IOException;
import java.util.*;
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
    public Beat findById(Long id) {
        return beatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(id)));
    }

    @Override
    public Beat create(String userId, Beat beat) {
        beat.setUser(Users.getUser(userId));

        Beat savedBeat = beatRepository.save(beat);

        Audio audio = new Audio();
        audio.setBeat(savedBeat);
        audioRepository.save(audio);

        return savedBeat;
    }

    @Override
    public void update(Beat beat) {
        beatRepository.save(beat);
    }

    @Override
    public void delete(Long id) {
        Beat beat = findById(id);
        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + id;

        DeleteAudioFiles.delete(beat, pathname);
        System.out.println(new File(pathname).delete());
        beatRepository.delete(beat);
    }

    @Override
    public void uploadImage(Long beatId, MultipartFile image) throws IOException {
        Beat beat = findById(beatId);
        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beatId;

        makeDirectory(beat, pathname);

        String imageName = beat.getImageName();
        if (imageName != null && !imageName.equals("")) {
            System.out.println(new File(pathname + "/" + imageName).delete());
        }

        beat.setImageName(saveFile(image, pathname, ".jpg"));
        beatRepository.save(beat);
    }

    @Override
    public void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException {
        Beat beat = findById(beatId);
        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beatId;
        Audio audio = beat.getAudio();

        makeDirectory(beat, pathname);

        DeleteAudioFiles.delete(beat, pathname);

        audio.setMp3Name(saveFile(mp3, pathname, ".mp3"));
        audio.setWavName(saveFile(wav, pathname, ".wav"));
        audio.setTrackStemsName(saveFile(zip, pathname, ".zip"));

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
    public void addPlay(Long id) {
        Beat beat = findById(id);
        beat.setPlays(beat.getPlays() + 1);
        beatRepository.save(beat);
    }

    @Override
    public void addToFavorite(Long beatId, String userId) {
        User user = Users.getUser(userId);
        user.getFavoriteBeats().add(findById(beatId));
        userRepository.save(user);
    }

    @Override
    public void removeFromFavorite(Long beatId, String userId) {
        User user = Users.getUser(userId);
        user.getFavoriteBeats().remove(findById(beatId));
        userRepository.save(user);
    }

    @Override
    public Cart addToCart(String userId, Long beatId, String license) {
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
                Cart cart = cartRepositoryByBeatAndUser.get();

                cart.setLicensing(Licensing.valueOf(license));

                Cart savedCart = cartRepository.save(cart);

                user.getCart().add(savedCart);

                userRepository.save(user);

                return savedCart;
            }
        }
        return null;
    }

    @Override
    public void removeFromCart(String userId, Long beatId) {
        User user = Users.getUser(userId);
        Beat beat = findById(beatId);
        for (Cart cart : user.getCart()) {
            if (cart.getBeat() == beat) {
                user.getCart().remove(cart);
                cartRepository.delete(cart);
                return;
            }
        }
    }

    @Override
    public void addToHistory(String userId, Long beatId) {
        User user = Users.getUser(userId);
        Beat beat = findById(beatId);
        List<Beat> history = user.getHistory();

        if (history.stream().anyMatch(b -> b == beat)) return;

        history.add(beat);
        userRepository.save(user);
    }

    @Override
    public List<Beat> getTrendBeats(Integer limit) {
        return sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BeatDto> getTopChart(String nameFilter, Long tag, String genre, Integer priceMin,
                                     Integer priceMax, String key, String mood, Integer bpmMin,
                                     Integer bpmMax, String userId, Pageable pageable
    ) {
        User user = userId != null ? Users.getUser(userId) : null;

        List<Beat> sortedBeats = sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .toList();

        if (nameFilter == null && tag == null && genre == null
            && priceMin == null && priceMax == null && key == null
            && mood == null && bpmMin == null && bpmMax == null
        ) return listToPage(pageable, mapToDtoList(user, sortedBeats));

        List<Beat> filteredBeats = nameFilter != null
                ? beatRepository.findAllByTitleContainsIgnoreCase(nameFilter)
                : new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {
            boolean add = tag == null || sortedBeat.getTags()
                    .stream()
                    .anyMatch(tag1 -> Objects.equals(tag1.getId(), tag));

            if (add && genre != null && !sortedBeat.getGenre().name().equals(genre)) add = false;

            if (add && priceMin != null && priceMax != null
                && (sortedBeat.getLicense().getPrice_mp3() < priceMin
                    || sortedBeat.getLicense().getPrice_mp3() > priceMax)) add = false;

            if (add && key != null && !sortedBeat.getKey().name().equals(key)) add = false;

            if (add && mood != null && !sortedBeat.getMood().name().equals(mood)) add = false;

            if (add && bpmMin != null && bpmMax != null
                && (sortedBeat.getBpm() < bpmMin || sortedBeat.getBpm() > bpmMax)) add = false;

            if (add) filteredBeats.add(sortedBeat);
        }

        return listToPage(pageable, mapToDtoList(user, filteredBeats));
    }

    @Override
    public Page<BeatDto> getFavoriteBeats(String userId, Pageable pageable) {
        User user = Users.getUser(userId);

        return listToPage(pageable, mapToDtoList(user, sortedPublishedBeats(user.getFavoriteBeats())));
    }

    @Override
    public Page<BeatDto> getHistoryBeats(String userId, Pageable pageable) {
        User user = Users.getUser(userId);

        return listToPage(pageable, mapToDtoList(user, sortedPublishedBeats(user.getHistory())));
    }

    @Override
    public Page<BeatDto> getBeats(String userId, String authUserId, Pageable pageable) {
        User authUser = authUserId != null ? Users.getUser(authUserId) : null;

        return listToPage(pageable, mapToDtoList(authUser, sortedPublishedBeats(Users.getUser(userId).getBeats())));
    }

    /* not Override */

    private void makeDirectory(Beat beat, String pathname) {
        List<File> files = List.of(
                new File(uploadPath),
                new File(uploadPath + "/user-" + beat.getUser().getId()),
                new File(uploadPath + "/user-" + beat.getUser().getId() + "/beats"),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists()) {
                boolean mkdir = file.mkdir();
                System.out.println(mkdir);
            }
        }
    }

    private String saveFile(MultipartFile file, String pathname, String type) throws IOException {
        if (file == null) return null;

        String resultFilename = UUID.randomUUID() + type;
        file.transferTo(new File(pathname + "/" + resultFilename));
        return resultFilename;
    }

    private List<Beat> sortedPublishedBeats(List<Beat> beats) {
        List<Beat> publishedBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getStatus() == BeatStatus.PUBLISHED) publishedBeats.add(beat);
        }

        return publishedBeats;
    }

    private PageImpl<BeatDto> listToPage(Pageable pageable, List<BeatDto> beatDtoList) {
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), beatDtoList.size());
        return new PageImpl<>(beatDtoList.subList(start, end), pageable, beatDtoList.size());
    }

    private List<BeatDto> mapToDtoList(User user, List<Beat> sortedBeats) {
        List<BeatDto> beatDtoList = new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {
            BeatDto beatDto = BeatDto.builder()
                    .beat(sortedBeat)
                    .addedToCart(false)
                    .build();

            if (user != null) {
                if (user.getCart().stream()
                        .anyMatch(c -> c.getBeat() == sortedBeat)) beatDto.setAddedToCart(true);
            }

            beatDtoList.add(beatDto);
        }

        return beatDtoList;
    }
}
