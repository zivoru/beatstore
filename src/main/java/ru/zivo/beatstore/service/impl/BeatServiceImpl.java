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
import ru.zivo.beatstore.repository.*;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.impl.common.DeleteAudioFiles;
import ru.zivo.beatstore.service.impl.common.Users;
import ru.zivo.beatstore.web.dto.BeatDto;

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

    private final LicenseRepository licenseRepository;

    @Autowired
    public BeatServiceImpl(BeatRepository beatRepository, UserRepository userRepository, AudioRepository audioRepository, CartRepository cartRepository, LicenseRepository licenseRepository) {
        this.beatRepository = beatRepository;
        this.userRepository = userRepository;
        this.audioRepository = audioRepository;
        this.cartRepository = cartRepository;
        this.licenseRepository = licenseRepository;
    }

    @Override
    public Beat findById(Long id) {
        return beatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(id)));
    }

    @Override
    public BeatDto findDtoById(String userId, Long id) {
        Beat beat = findById(id);
        BeatDto beatDto = BeatDto.builder().beat(beat).addedToCart(false).build();
        if (userId == null) return beatDto;

        User user = Users.getUser(userId);
        for (Cart cart : user.getCart()) {
            if (cart.getBeat() == beat) {
                beatDto.setAddedToCart(true);
                beatDto.setLicensing(cart.getLicensing());
                return beatDto;
            }
        }
        return beatDto;
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
    public void update(String userId, Long beatId, Beat newBeat) {
        Beat beat = findById(beatId);

        if (!beat.getUser().getId().equals(userId)) return;

        if (newBeat.getFree()) cartRepository.deleteAll(cartRepository.findAllByBeat(beat));

        beat.setTitle(newBeat.getTitle());
        beat.setFree(newBeat.getFree());
        beat.setGenre(newBeat.getGenre());
        beat.setMood(newBeat.getMood());
        beat.setDescription(newBeat.getDescription());
        beat.setBpm(newBeat.getBpm());
        beat.setKey(newBeat.getKey());
        beatRepository.save(beat);
    }

    @Override
    public void publication(String userId, Long beatId) {
        User user = Users.getUser(userId);
        Beat beat = findById(beatId);
        if (user.getId().equals(beat.getUser().getId())) {
            beat.setStatus(BeatStatus.PUBLISHED);
            beatRepository.save(beat);
        }
    }

    @Override
    public void delete(String userId, Long beatId) {
        Beat beat = findById(beatId);
        if (!beat.getUser().getId().equals(userId)) return;

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beatId;
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

        if (mp3 != null) {
            String name = beat.getAudio().getMp3Name();
            if (name != null && !name.equals("")) {
                System.out.println(new File(pathname + "/" + name).delete());
            }
            audio.setMp3Name(saveFile(mp3, pathname, ".mp3"));
            audio.setMp3OriginalName(mp3.getOriginalFilename());
        }
        if (wav != null) {
            String name = beat.getAudio().getWavName();
            if (name != null && !name.equals("")) {
                System.out.println(new File(pathname + "/" + name).delete());
            }
            audio.setWavName(saveFile(wav, pathname, ".wav"));
            audio.setWavOriginalName(wav.getOriginalFilename());
        }
        if (zip != null) {
            String name = beat.getAudio().getZipName();
            if (name != null && !name.equals("")) {
                System.out.println(new File(pathname + "/" + name).delete());
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
        if (beat.getLicense() != null) license.setId(beat.getLicense().getId());
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

        if (cartRepository.existsByBeatAndUserAndLicensing(beat, user, Licensing.valueOf(license))) {
            return null;
        }
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
    public Page<BeatDto> getTopChart(String nameFilter, Long tag, String genre, Integer priceMin,
                                     Integer priceMax, String key, String mood, Integer bpmMin,
                                     Integer bpmMax, String userId, Pageable pageable
    ) {
        User user = userId != null ? Users.getUser(userId) : null;

        List<Beat> sortedBeats = new ArrayList<>(sortedPublishedBeats(nameFilter != null
                ? beatRepository.findAllByTitleContainsIgnoreCase(nameFilter)
                : beatRepository.findAll())
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .toList());

        Collections.reverse(sortedBeats);

        if (nameFilter == null && tag == null && genre == null
            && priceMin == null && priceMax == null && key == null
            && mood == null && bpmMin == null && bpmMax == null
        ) return listToPage(pageable, mapToDtoList(user, sortedBeats));

        List<Beat> filteredBeats = new ArrayList<>();

        for (Beat sortedBeat : sortedBeats) {
            boolean add = tag == null || sortedBeat.getTags()
                    .stream()
                    .anyMatch(tag1 -> Objects.equals(tag1.getId(), tag));

            if (add && genre != null && !sortedBeat.getGenre().name().equals(genre)) {
                add = false;
            }

            if (add && priceMin != null && priceMax != null) {
                if (sortedBeat.getLicense().getPrice_mp3() < priceMin || sortedBeat.getLicense().getPrice_mp3() > priceMax) {
                    add = false;
                }
                if (sortedBeat.getFree()) {
                    add = true;
                }
            }

            if (add && key != null && !sortedBeat.getKey().name().equals(key)) {
                add = false;
            }

            if (add && mood != null && !sortedBeat.getMood().name().equals(mood)) {
                add = false;
            }

            if (sortedBeat.getBpm() != null) {
                if (add && bpmMin != null && bpmMax != null
                    && (sortedBeat.getBpm() < bpmMin || sortedBeat.getBpm() > bpmMax)) {
                    add = false;
                }
            }

            if (add) {
                filteredBeats.add(sortedBeat);
            }
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

    @Override
    public List<Beat> getDrafts(String userId) {
        List<Beat> drafts = new ArrayList<>();
        for (Beat beat : Users.getUser(userId).getBeats()) {
            if (beat.getStatus() == BeatStatus.DRAFT) drafts.add(beat);
        }
        Collections.reverse(drafts);
        return drafts;
    }

    @Override
    public List<Beat> getSold(String userId) {
        List<Beat> sold = new ArrayList<>();
        for (Beat beat : Users.getUser(userId).getBeats()) {
            if (beat.getStatus() == BeatStatus.SOLD) sold.add(beat);
        }
        Collections.reverse(sold);
        return sold;
    }

    @Override
    public List<Beat> getSimilarBeats(Long beatId, Integer limit) {
        Beat beatById = findById(beatId);
        List<Beat> beats = sortedPublishedBeats(beatRepository.findAll());
        List<Beat> similar = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getGenre() == beatById.getGenre()) {
                similar.add(beat);
            }
        }

        return similar
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BeatDto> getFreeBeats(String userId, Pageable pageable) {
        List<Beat> beats = sortedPublishedBeats(beatRepository.findAll());

        List<Beat> freeBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getFree()) {
                freeBeats.add(beat);
            }
        }

        return listToPage(pageable, mapToDtoList(Users.getUser(userId), freeBeats));
    }

    @Override
    public Page<BeatDto> findAllByGenre(String userId, String genre, Pageable pageable) {
        List<Beat> beats = sortedPublishedBeats(beatRepository.findAll());

        List<Beat> findAllByGenre = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getGenre().toString().equals(genre)) findAllByGenre.add(beat);
        }

        return listToPage(pageable, mapToDtoList(Users.getUser(userId), findAllByGenre));
    }

    @Override
    public Page<BeatDto> findAllByTag(String userId, Long tagId, Pageable pageable) {
        List<Beat> beats = sortedPublishedBeats(beatRepository.findAll());

        List<Beat> findAllByTag = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getTags().stream().anyMatch(tag1 -> Objects.equals(tag1.getId(), tagId))) findAllByTag.add(beat);
        }

        return listToPage(pageable, mapToDtoList(Users.getUser(userId), findAllByTag));
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

        Collections.reverse(beatDtoList);
        return beatDtoList;
    }
}
