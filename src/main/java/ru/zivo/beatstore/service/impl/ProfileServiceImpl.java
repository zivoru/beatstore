package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.ProfileService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Value("${upload.path}")
    private String uploadPath;

    private UserRepository userRepository;

    private ProfileRepository profileRepository;

    @Autowired
    public ProfileServiceImpl(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public Profile updateProfile(Long userId, Profile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(userId)));

        profile.setUser(user);
        Profile savedProfile = profileRepository.save(profile);

        user.setProfile(savedProfile);
        userRepository.save(user);

        return savedProfile;
    }

    @Override
    public void updateImage(Long profileId, MultipartFile photo) throws IOException {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new NotFoundException("Профиль с id = %d не найден".formatted(profileId)));

        Long userId = profile.getUser().getId();

        if (photo != null && !photo.getOriginalFilename().isEmpty()) {

            String pathname = uploadPath + "/user-" + userId + "/profile";

            List<File> files = List.of(
                    new File(uploadPath),
                    new File(uploadPath + "/user-" + userId),
                    new File(pathname)
            );

            for (File file : files) {
                if (!file.exists()) {
                    file.mkdir();
                }
            }

            String imageName = profile.getImageName();

            if (imageName != null) {
                File file = new File(pathname + "/" + imageName);
                file.delete();
            }

            String uuidFile = UUID.randomUUID().toString();
//            String resultFilename = uuidFile + "." + photo.getOriginalFilename();
            String resultFilename = uuidFile;

            photo.transferTo(new File(pathname + "/" + resultFilename));

            profile.setImageName(resultFilename);
            profileRepository.save(profile);
        }
    }
}