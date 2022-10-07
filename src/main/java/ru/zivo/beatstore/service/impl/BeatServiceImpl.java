package ru.zivo.beatstore.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.filters.Filters;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.*;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Genre;
import ru.zivo.beatstore.model.enums.Licensing;
import ru.zivo.beatstore.repository.*;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.service.impl.common.DeleteFiles;
import ru.zivo.beatstore.web.dto.DisplayBeatDto;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.*;

@Slf4j
@Service
public class BeatServiceImpl implements BeatService {

    private static final String PREFIX_USER = "/user-";
    private static final String PREFIX_BEAT = "/beats/beat-";

    private final String uploadPath;

    private final BeatRepository beatRepository;

    private final UserRepository userRepository;

    private final AudioRepository audioRepository;

    private final CartRepository cartRepository;

    private final LicenseRepository licenseRepository;

    private final UserService userService;

    @Autowired
    public BeatServiceImpl(BeatRepository beatRepository, UserRepository userRepository,
                           AudioRepository audioRepository, CartRepository cartRepository,
                           LicenseRepository licenseRepository, BeatstoreProperties beatstoreProperties, UserService userService) {
        this.beatRepository = beatRepository;
        this.userRepository = userRepository;
        this.audioRepository = audioRepository;
        this.cartRepository = cartRepository;
        this.licenseRepository = licenseRepository;
        this.uploadPath = beatstoreProperties.getUploadPath();
        this.userService = userService;
    }

    @Override
    public Beat findById(Long id) {
        return beatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(id)));
    }

    @Override
    public DisplayBeatDto findDtoById(String userId, Long id) {
        Beat beat = findById(id);
        DisplayBeatDto displayBeatDto = DisplayBeatDto.builder().beat(beat).addedToCart(false).build();
        if (userId == null) {
            return displayBeatDto;
        }

        User user = userService.findById(userId);
        for (Cart cart : user.getCart()) {
            if (cart.getBeat() == beat) {
                displayBeatDto.setAddedToCart(true);
                displayBeatDto.setLicensing(cart.getLicensing());
                return displayBeatDto;
            }
        }
        return displayBeatDto;
    }

    @Override
    public Beat create(String userId, Beat beat) {
        beat.setUser(userService.findById(userId));

        Beat savedBeat = beatRepository.save(beat);

        Audio audio = new Audio();
        audio.setBeat(savedBeat);
        audioRepository.save(audio);

        return savedBeat;
    }

    @Override
    public void update(String userId, Long beatId, Beat newBeat) {
        Beat beat = findById(beatId);

        if (!beat.getUser().getId().equals(userId)) {
            return;
        }

        boolean free = newBeat.getFree();

        if (free) {
            cartRepository.deleteAll(cartRepository.findAllByBeat(beat));
        }

        beat.setTitle(newBeat.getTitle());
        beat.setFree(free);
        beat.setGenre(newBeat.getGenre());
        beat.setMood(newBeat.getMood());
        beat.setDescription(newBeat.getDescription());
        beat.setBpm(newBeat.getBpm());
        beat.setKey(newBeat.getKey());
        beatRepository.save(beat);
    }

    @Override
    public void publication(String userId, Long beatId) {
        User user = userService.findById(userId);
        Beat beat = findById(beatId);
        if (user.getId().equals(beat.getUser().getId())) {
            beat.setStatus(BeatStatus.PUBLISHED);
            beatRepository.save(beat);
        }
    }

    @Override
    public void delete(String userId, Long beatId) {
        Beat beat = findById(beatId);
        if (userId == null) {
            return;
        }
        if (!beat.getUser().getId().equals(userId)) {
            return;
        }

        String pathname = uploadPath + PREFIX_USER + beat.getUser().getId() + PREFIX_BEAT + beatId;
        DeleteFiles.delete(beat, pathname);
        DeleteFiles.deleteFile(Path.of(pathname));

        beatRepository.delete(beat);
    }

    @Override
    public void uploadImage(Long beatId, MultipartFile image) throws IOException {
        Beat beat = findById(beatId);
        String pathname = uploadPath + PREFIX_USER + beat.getUser().getId() + PREFIX_BEAT + beatId;

        makeDirectory(beat, pathname);

        String imageName = beat.getImageName();
        if (imageName != null && !imageName.equals("")) {
            DeleteFiles.deleteFile(Path.of(pathname, imageName));
        }

        beat.setImageName(saveFile(image, pathname, ".jpg"));
        beatRepository.save(beat);
    }

    @Override
    public void uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException {
        Beat beat = findById(beatId);
        String pathname = uploadPath + PREFIX_USER + beat.getUser().getId() + PREFIX_BEAT + beatId;
        Audio audio = beat.getAudio();

        makeDirectory(beat, pathname);

        if (mp3 != null) {
            String name = beat.getAudio().getMp3Name();
            if (name != null && !name.equals("")) {
                DeleteFiles.deleteFile(Path.of(pathname, name));
            }
            audio.setMp3Name(saveFile(mp3, pathname, ".mp3"));
            audio.setMp3OriginalName(mp3.getOriginalFilename());
        }
        if (wav != null) {
            String name = beat.getAudio().getWavName();
            if (name != null && !name.equals("")) {
                DeleteFiles.deleteFile(Path.of(pathname, name));
            }
            audio.setWavName(saveFile(wav, pathname, ".wav"));
            audio.setWavOriginalName(wav.getOriginalFilename());
        }
        if (zip != null) {
            String name = beat.getAudio().getZipName();
            if (name != null && !name.equals("")) {
                DeleteFiles.deleteFile(Path.of(pathname, name));
            }
            audio.setZipName(saveFile(zip, pathname, ".zip"));
            audio.setZipOriginalName(zip.getOriginalFilename());
        }

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
        if (beat.getLicense() != null) {
            license.setId(beat.getLicense().getId());
        }
        license.setBeat(beat);
        licenseRepository.save(license);
    }

    @Override
    public void addPlay(Long id) {
        Beat beat = findById(id);
        beat.setPlays(beat.getPlays() + 1);
        beatRepository.save(beat);
    }

    @Override
    public void addToFavorite(Long beatId, String userId) {
        User user = userService.findById(userId);
        user.getFavoriteBeats().add(findById(beatId));
        userRepository.save(user);
    }

    @Override
    public void removeFromFavorite(Long beatId, String userId) {
        User user = userService.findById(userId);
        user.getFavoriteBeats().remove(findById(beatId));
        userRepository.save(user);
    }

    @Override
    public Cart addToCart(String userId, Long beatId, String license) {
        User user = userService.findById(userId);
        Beat beat = findById(beatId);

        if (cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.valueOf(license))) {
            return null;
        }
        Optional<Cart> cartRepositoryByBeatAndUser = cartRepository.findByBeatAndUser(beat, user);
        if (cartRepositoryByBeatAndUser.isEmpty()) {
            Cart cart = new Cart(Licensing.valueOf(license), user, beat);

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

    @Override
    public void removeFromCart(String userId, Long beatId) {
        User user = userService.findById(userId);
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
        User user = userService.findById(userId);
        Beat beat = findById(beatId);
        List<Beat> history = user.getHistory();

        if (history.contains(beat)) {
            return;
        }

        history.add(beat);
        userRepository.save(user);
    }

    @Override
    public Page<DisplayBeatDto> getTopChart(String nameFilter, Filters filters, String userId, Pageable pageable
    ) {
        User user = userId != null ? userService.findById(userId) : null;

        List<Beat> sortedBeats = new ArrayList<>(sortedPublishedBeats(nameFilter != null
                ? beatRepository.findAllByTitleContainsIgnoreCase(nameFilter)
                : beatRepository.findAll())
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .toList());

        Collections.reverse(sortedBeats);

        if (nameFilter == null && filters.getTag() == null && filters.getGenre() == null
            && filters.getPriceMin() == null && filters.getPriceMax() == null && filters.getKey() == null
            && filters.getMood() == null && filters.getBpmMin() == null && filters.getBpmMax() == null) {
            return listToPage(pageable, mapToDtoList(user, sortedBeats));
        }

        List<Beat> filteredBeats = filterBeatsForTopChart(sortedBeats, filters);

        return listToPage(pageable, mapToDtoList(user, filteredBeats));
    }

    private static List<Beat> filterBeatsForTopChart(List<Beat> sortedBeats, Filters filters) {
        List<Beat> filteredBeats = new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {
            boolean add = checkTags(filters, sortedBeat);
            add = add && checkGenre(filters, sortedBeat);
            add = add && checkKey(filters, sortedBeat);
            add = add && checkMood(filters, sortedBeat);
            add = add && checkBpm(filters, sortedBeat);
            add = add && (checkPrice(filters, sortedBeat) || checkFree(sortedBeat));

            if (add) {
                filteredBeats.add(sortedBeat);
            }
        }
        return filteredBeats;
    }

    private static boolean checkFree(Beat sortedBeat) {
        return sortedBeat.getFree();
    }

    private static boolean checkPrice(Filters filters, Beat sortedBeat) {
        return filters.getPriceMin() != null && filters.getPriceMax() != null
               && (sortedBeat.getLicense().getPriceMp3() < filters.getPriceMin()
                   || sortedBeat.getLicense().getPriceMp3() > filters.getPriceMax());
    }

    private static boolean checkTags(Filters filters, Beat sortedBeat) {
        return filters.getTag() == null || sortedBeat.getTags()
                .stream()
                .anyMatch(tag1 -> Objects.equals(tag1.getId(), filters.getTag()));
    }

    private static boolean checkGenre(Filters filters, Beat sortedBeat) {
        return filters.getGenre() != null && !sortedBeat.getGenre().name().equals(filters.getGenre());
    }

    private static boolean checkKey(Filters filters, Beat sortedBeat) {
        return filters.getKey() != null && !sortedBeat.getKey().name().equals(filters.getKey());
    }

    private static boolean checkMood(Filters filters, Beat sortedBeat) {
        return filters.getMood() != null && !sortedBeat.getMood().name().equals(filters.getMood());
    }

    private static boolean checkBpm(Filters filters, Beat sortedBeat) {
        return sortedBeat.getBpm() != null
               && (filters.getBpmMin() != null && filters.getBpmMax() != null
                   && (sortedBeat.getBpm() < filters.getBpmMin() || sortedBeat.getBpm() > filters.getBpmMax()));
    }

    @Override
    public Page<DisplayBeatDto> getFavoriteBeats(String userId, Pageable pageable) {
        User user = userService.findById(userId);

        return listToPage(pageable, mapToDtoList(user, sortedPublishedBeats(user.getFavoriteBeats())));
    }

    @Override
    public Page<DisplayBeatDto> getHistoryBeats(String userId, Pageable pageable) {
        User user = userService.findById(userId);

        return listToPage(pageable, mapToDtoList(user, sortedPublishedBeats(user.getHistory())));
    }

    @Override
    public Page<DisplayBeatDto> getBeats(String userId, String authUserId, Pageable pageable) {
        User authUser = authUserId != null ? userService.findById(authUserId) : null;

        return listToPage(pageable, mapToDtoList(authUser, sortedPublishedBeats(userService.findById(userId).getBeats())));
    }

    @Override
    public List<Beat> getDrafts(String userId) {
        return userService.findById(userId).getBeats()
                .stream()
                .filter(beat -> beat.getStatus() == BeatStatus.DRAFT)
                .toList();
    }

    @Override
    public List<Beat> getSold(String userId) {
        return userService.findById(userId).getBeats()
                .stream()
                .filter(beat -> beat.getStatus() == BeatStatus.SOLD)
                .toList();
    }

    @Override
    public List<Beat> getSimilarBeats(Long beatId, Integer limit) {
        Genre genre = findById(beatId).getGenre();

        return sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .filter(beat -> beat.getGenre() == genre)
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .limit(limit)
                .toList();
    }

    @Override
    public Page<DisplayBeatDto> getFreeBeats(String userId, Pageable pageable) {
        List<Beat> freeBeats = sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .filter(Beat::getFree)
                .toList();

        return listToPage(pageable, mapToDtoList(userId != null ? userService.findById(userId) : null, freeBeats));
    }

    @Override
    public Page<DisplayBeatDto> findAllByGenre(String userId, String genre, Pageable pageable) {
        List<Beat> findAllByGenre = sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .filter(beat -> beat.getGenre().toString().equals(genre))
                .toList();

        return listToPage(pageable, mapToDtoList(userId != null ? userService.findById(userId) : null, findAllByGenre));
    }

    @Override
    public Page<DisplayBeatDto> findAllByTag(String userId, Long tagId, Pageable pageable) {
        List<Beat> findAllByTag = sortedPublishedBeats(beatRepository.findAll())
                .stream()
                .filter(beat -> beat.getTags().stream().anyMatch(tag1 -> Objects.equals(tag1.getId(), tagId)))
                .toList();

        return listToPage(pageable, mapToDtoList(userId != null ? userService.findById(userId) : null, findAllByTag));
    }

    private void makeDirectory(Beat beat, String pathname) {
        List<File> files = List.of(
                new File(uploadPath),
                new File(uploadPath + PREFIX_USER + beat.getUser().getId()),
                new File(uploadPath + PREFIX_USER + beat.getUser().getId() + "/beats"),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists() && !file.mkdir()) {
                log.info("Не удалось создать файл: {}", file.getName());
            }
        }
    }

    private String saveFile(MultipartFile file, String pathname, String type) throws IOException {
        if (file == null) {
            return null;
        }

        String resultFilename = UUID.randomUUID() + type;
        file.transferTo(new File("%s/%s".formatted(pathname, resultFilename)));
        return resultFilename;
    }

    private List<Beat> sortedPublishedBeats(List<Beat> beats) {
        return beats.stream()
                .filter(beat -> beat.getStatus() == BeatStatus.PUBLISHED)
                .toList();
    }

    private PageImpl<DisplayBeatDto> listToPage(Pageable pageable, List<DisplayBeatDto> displayBeatDtoList) {
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), displayBeatDtoList.size());
        return new PageImpl<>(displayBeatDtoList.subList(start, end), pageable, displayBeatDtoList.size());
    }

    private List<DisplayBeatDto> mapToDtoList(User user, List<Beat> sortedBeats) {
        List<DisplayBeatDto> displayBeatDtoList = new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {
            DisplayBeatDto displayBeatDto = DisplayBeatDto.builder()
                    .beat(sortedBeat)
                    .addedToCart(false)
                    .build();

            if (user != null && user.getCart().stream().anyMatch(c -> c.getBeat() == sortedBeat)) {
                displayBeatDto.setAddedToCart(true);
            }

            displayBeatDtoList.add(displayBeatDto);
        }

        Collections.reverse(displayBeatDtoList);
        return displayBeatDtoList;
    }
}
