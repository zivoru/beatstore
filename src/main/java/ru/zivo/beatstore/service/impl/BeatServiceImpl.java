package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.*;
import ru.zivo.beatstore.repository.AudioRepository;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.BeatService;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class BeatServiceImpl implements BeatService {

    @Value("${upload.path}")
    private String uploadPath;

    private final BeatRepository beatRepository;

    private final UserRepository userRepository;

    private final AudioRepository audioRepository;

    @Autowired
    public BeatServiceImpl(BeatRepository beatRepository, UserRepository userRepository, AudioRepository audioRepository) {
        this.beatRepository = beatRepository;
        this.userRepository = userRepository;
        this.audioRepository = audioRepository;
    }

    @Override
    public Beat create(Long userId, Beat beat) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(userId)));

        beat.setUser(user);

        Beat savedBeat = beatRepository.save(beat);

        Audio audio = new Audio();
        audio.setBeat(savedBeat);
        audioRepository.save(audio);

        beat.setAudio(audio);

        return beatRepository.save(beat);
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
    public Set<Beat> getBeats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));
        return user.getBeats();
    }
    @Override
    public Set<Cart> getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));
        return user.getCart();
    }
    @Override
    public Set<Purchased> getPurchasedBeats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));
        return user.getPurchased();
    }
    @Override
    public Set<Beat> getFavoriteBeats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));
        return user.getFavorite();
    }
    @Override
    public Set<Beat> getHistoryBeats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));
        return user.getHistory();
    }
    @Override
    public void delete(Long id) {
        Beat beat = findById(id);

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats" + "/beat-" + id;

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

        File file = new File(pathname);
        file.delete();

        beatRepository.delete(beat);
    }

    @Override
    public Beat uploadAudio(Long beatId, MultipartFile mp3, MultipartFile wav, MultipartFile zip) throws IOException {
        Beat beat = findById(beatId);

        String pathname = uploadPath + "/user-" + beat.getUser().getId() + "/beats" + "/beat-" + beatId;

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

        Audio audio = beat.getAudio();

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

        String mp3Name = saveFile(mp3, pathname);
        String wavName = saveFile(wav, pathname);
        String zipName = saveFile(zip, pathname);

        audio.setMp3Name(mp3Name);
        audio.setWavName(wavName);
        audio.setTrackStemsName(zipName);

        audioRepository.save(audio);

        return beatRepository.save(beat);
    }

    private String saveFile(MultipartFile file, String pathname) throws IOException {
        if (file == null || file.getOriginalFilename().isEmpty()) {
            return null;
        }

        String uuidFile = UUID.randomUUID().toString();
        String resultFilename = uuidFile + "." + file.getOriginalFilename();

        file.transferTo(new File(pathname + "/" + resultFilename));

        return resultFilename;
    }
}
