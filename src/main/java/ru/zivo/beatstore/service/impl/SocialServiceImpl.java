package ru.zivo.beatstore.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Social;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.SocialRepository;
import ru.zivo.beatstore.service.SocialService;
import ru.zivo.beatstore.service.UserService;

@Service
@RequiredArgsConstructor
public class SocialServiceImpl implements SocialService {

    private final SocialRepository socialRepository;
    private final UserService userService;

    @Override
    public void update(String userId, Social social) {
        if (userId == null || social == null) {
            throw new IllegalArgumentException("userId or social is null");
        }
        User user = userService.findById(userId);
        social.setId(user.getSocial().getId());
        social.setUser(user);
        socialRepository.save(social);
    }
}
