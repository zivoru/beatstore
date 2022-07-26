package ru.zivo.beatstore.service;

import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Profile;

import java.io.IOException;

public interface ProfileService {
    Profile updateProfile(String userId, Profile profile);

    void updateImage(Long profileId, MultipartFile photo) throws IOException;
}
