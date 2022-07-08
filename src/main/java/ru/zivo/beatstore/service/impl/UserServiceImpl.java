package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.UserService;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Value("${upload.path}")
    private String uploadPath;

    private UserRepository userRepository;

    private ProfileRepository profileRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public User register(Long userId, MultipartFile photo) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));

        if (photo != null && !photo.getOriginalFilename().isEmpty()) {
            File uploadDir = new File(uploadPath);
            File uploadDir1 = new File(uploadPath + "/user-" + userId );
            File uploadDir2 = new File(uploadPath + "/user-" + userId + "/profile");

            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }

            if (!uploadDir1.exists()) {
                uploadDir1.mkdir();
            }

            if (!uploadDir2.exists()) {
                uploadDir2.mkdir();
            }

            String uuidFile = UUID.randomUUID().toString();
            String resultFilename = uuidFile + "." + photo.getOriginalFilename();

            photo.transferTo(new File(uploadPath + "/user-" + userId + "/profile" + "/" + resultFilename));

            Profile profile = user.getProfile();

            if (profile == null) {
                profile = new Profile();
            }
            if (user.getProfile() != null) {
                String imageName = user.getProfile().getImageName();
                if (imageName != null) {
                    File file = new File(uploadPath + "/user-" + userId + "/profile" + "/" + imageName);
                    file.delete();
                }
            }
            profile.setUser(user);
            profile.setImageName(resultFilename);
            profileRepository.save(profile);

            user.setProfile(profile);
        }

        return userRepository.save(user);
    }

    @Override
    public User update(User user) {
        return null;
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(id)));
    }

    @Override
    public void delete(Long id) {



        User user = findById(id);

        Set<Beat> beats = user.getBeats();

        if (!CollectionUtils.isEmpty(beats)) {
            for (Beat beat : beats) {
                String pathname = uploadPath + "/user-" + id + "/beats" + "/beat-" + beat.getId();

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
            }
        }
        File file = new File(uploadPath + "/user-" + id + "/beats");
        file.delete();

        File file1 = new File(uploadPath + "/user-" + id);
        file1.delete();

        userRepository.delete(user);
    }
}
