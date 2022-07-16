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
    public Beat create(Long userId, Beat beat) {
        User user = getUser(userId);

        beat.setUser(user);

        Beat savedBeat = beatRepository.save(beat);

        Audio audio = new Audio();
        audio.setBeat(savedBeat);
        audioRepository.save(audio);
        beat.setAudio(audio);

        License license = new License();
        license.setPrice_mp3(1000);
        license.setPrice_wav(2000);
        license.setPrice_unlimited(5000);
        license.setPrice_exclusive(10000);
        license.setBeat(beat);

        beat.setLicense(license);

        return beatRepository.save(beat);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(userId)));
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

        deleteFiles(beat, pathname);

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

        deleteFiles(beat, pathname);

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
        User user = getUser(userId);
        Beat byId = findById(beatId);

        for (Beat beat : user.getFavorite()) {
            if (beat == byId) {
                user.getFavorite().remove(beat);
                userRepository.save(user);
                return;
            }
        }

        user.getFavorite().add(byId);

        userRepository.save(user);
    }

    private void deleteFiles(Beat beat, String pathname) {
        if (beat.getAudio() != null) {
            List<String> names = new ArrayList<>();

            names.add(beat.getAudio().getMp3Name());
            names.add(beat.getAudio().getWavName());
            names.add(beat.getAudio().getTrackStemsName());

            for (String name : names) {
                if (name != null) {
                    File file = new File(pathname + "/" + name);
                    file.delete();
                }
            }
        }
    }

    private String saveFile(MultipartFile file, String pathname) throws IOException {
        if (file == null || file.getOriginalFilename().isEmpty()) {
            return null;
        }

        String uuidFile = UUID.randomUUID().toString();
//        String resultFilename = uuidFile + "." + file.getOriginalFilename();
        String resultFilename = uuidFile;

        file.transferTo(new File(pathname + "/" + resultFilename));

        return resultFilename;
    }

    @Override
    public Cart addToCart(Long userId, Long beatId, String license) {
        User user = getUser(userId);
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
        User user = getUser(userId);
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
    public Page<Beat> getTopChart(
            String nameFilter,
            Long[] tags,
            String[] genres,
            Integer priceMin,
            Integer priceMax,
            String key,
            Integer bpmMin,
            Integer bpmMax,
            Pageable pageable
    ) {

        List<Beat> beats = beatRepository.findAll();

        List<Beat> publishedBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(beat);
            }
        }

        List<Beat> sortedBeats = publishedBeats.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getPlays(), o1.getPlays())).toList();

        if (nameFilter == null
                && tags == null
                && genres == null
                && priceMin == null
                && priceMax == null
                && key == null
                && bpmMin == null
                && bpmMax == null
        ) {
            final int start = (int) pageable.getOffset();
            final int end = Math.min((start + pageable.getPageSize()), sortedBeats.size());

            return new PageImpl<>(sortedBeats.subList(start, end), pageable, sortedBeats.size());
        }

        Set<Beat> filteredBeats = new LinkedHashSet<>();

        if (nameFilter != null) {
            filteredBeats = beatRepository.findAllByTitleContainsIgnoreCase(nameFilter);
        }

        for (Beat sortedBeat : sortedBeats) {
            if (tags != null) {
                for (Long tag : tags) {
                    List<Tag> beatTags = sortedBeat.getTags();
                    for (Tag beatTag : beatTags) {
                        if (Objects.equals(beatTag.getId(), tag)) {
                            filteredBeats.add(sortedBeat);
                        }
                    }
                }
            }

            if (genres != null) {
                for (String genre : genres) {
                    if (sortedBeat.getGenre().name().equals(genre)) {
                        filteredBeats.add(sortedBeat);
                    }
                }
            }

            if (priceMin != null && priceMax != null) {
                if (sortedBeat.getLicense().getPrice_mp3() >= priceMin
                    &&
                    sortedBeat.getLicense().getPrice_mp3() <= priceMax
                ) {
                    filteredBeats.add(sortedBeat);
                }
            }


            if (key != null) {
                if (sortedBeat.getKey().name().equals(key)) {
                    filteredBeats.add(sortedBeat);
                }
            }

            if (bpmMin != null && bpmMax != null) {
                if (sortedBeat.getBpm() >= bpmMin
                    &&
                    sortedBeat.getBpm() <= bpmMax
                ) {
                    filteredBeats.add(sortedBeat);
                }
            }
        }

        List<Beat> collect = filteredBeats.stream().toList();

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), collect.size());

        return new PageImpl<>(collect.subList(start, end), pageable, collect.size());
    }
}
