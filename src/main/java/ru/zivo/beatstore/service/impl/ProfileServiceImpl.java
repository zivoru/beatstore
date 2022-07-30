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
import ru.zivo.beatstore.service.impl.common.Users;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Value("${upload.path}")
    private String uploadPath;

    private final UserRepository userRepository;

    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileServiceImpl(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public Profile updateProfile(String userId, Profile profile) {
        Profile userProfile = Users.getUser(userId).getProfile();

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

        if (photo != null) {
            String pathname = uploadPath + "/user-" + userId + "/profile";

            List<File> files = List.of(
                    new File(uploadPath),
                    new File(uploadPath + "/user-" + userId),
                    new File(pathname)
            );

            for (File file : files) {
                if (!file.exists()) {
                    boolean mkdir = file.mkdir();
                    System.out.println(mkdir);
                }
            }

            String imageName = profile.getImageName();

            if (imageName != null && !imageName.equals("")) {
                System.out.println(new File(pathname + "/" + imageName).delete());
            }

            String resultFilename = UUID.randomUUID() + ".jpg";
            photo.transferTo(new File(pathname + "/" + resultFilename));
            profile.setImageName(resultFilename);

            profileRepository.save(profile);
        }
    }
}
