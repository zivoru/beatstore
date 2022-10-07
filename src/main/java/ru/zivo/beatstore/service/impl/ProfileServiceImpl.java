package ru.zivo.beatstore.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.service.ProfileService;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.service.impl.common.DeleteFiles;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ProfileServiceImpl implements ProfileService {

    private final String uploadPath;

    private final ProfileRepository profileRepository;

    private final UserService userService;

    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository, BeatstoreProperties beatstoreProperties, UserService userService) {
        this.profileRepository = profileRepository;
        this.uploadPath = beatstoreProperties.getUploadPath();
        this.userService = userService;
    }

    @Override
    public Profile updateProfile(String userId, Profile profile) {
        Profile userProfile = userService.findById(userId).getProfile();

        userProfile.setFirstName(profile.getFirstName());
        userProfile.setLastName(profile.getLastName());
        userProfile.setDisplayName(profile.getDisplayName());
        userProfile.setLocation(profile.getLocation());
        userProfile.setBiography(profile.getBiography());

        return profileRepository.save(userProfile);
    }

    @Override
    public void updateImage(Long profileId, MultipartFile photo) throws IOException {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new NotFoundException("Профиль с id = %d не найден".formatted(profileId)));

        String userId = profile.getUser().getId();

        if (photo == null) {
            return;
        }

        String pathname = uploadPath + "/user-" + userId + "/profile";

        List<File> files = List.of(
                new File(uploadPath),
                new File(uploadPath + "/user-" + userId),
                new File(pathname)
        );

        for (File file : files) {
            if (!file.exists() && !file.mkdir()) {
                log.info("Не удалось создать файл: {}", file.getName());
            }
        }

        String imageName = profile.getImageName();

        if (imageName != null && !imageName.equals("")) {
            DeleteFiles.deleteFile(Path.of(pathname, imageName));
        }

        String resultFilename = UUID.randomUUID() + ".jpg";
        photo.transferTo(new File("%s/%s".formatted(pathname, resultFilename)));
        profile.setImageName(resultFilename);

        profileRepository.save(profile);
    }
}
