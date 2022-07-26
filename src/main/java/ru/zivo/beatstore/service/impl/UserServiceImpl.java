package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.service.impl.common.DeleteAudioFiles;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Value("${upload.path}")
    private String uploadPath;

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register() {
        return null;
    }

    @Override
    public User update(User user) {
        return null;
    }

    @Override
    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %s не найден".formatted(id)));
    }

    @Override
    public void delete(String id) {
        User user = findById(id);

        List<Beat> beats = user.getBeats();

        if (!CollectionUtils.isEmpty(beats)) {
            for (Beat beat : beats) {
                String pathname = uploadPath + "/user-" + id + "/beats" + "/beat-" + beat.getId();

                DeleteAudioFiles.delete(beat, pathname);

                System.out.println(new File(pathname).delete());
            }
        }

        System.out.println(new File(uploadPath + "/user-" + id + "/beats").delete());
        System.out.println(new File(uploadPath + "/user-" + id).delete());

        userRepository.delete(user);
    }

    @Override
    public List<User> getRecommended(Integer limit) {
        return userRepository.findAll()
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getSubscribers().size(), o1.getSubscribers().size()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public DisplayUserDto getDisplayUserDto(String username, String authUserId) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Пользователь с username = %s не найден".formatted(username)));

        DisplayUserDto displayUserDto = DisplayUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .verified(user.getVerified())
                .profile(user.getProfile())
                .social(user.getSocial())
                .amountSubscribers(user.getSubscribers().size())
                .amountBeats(user.getBeats().size())
                .amountPlays(user.getBeats().stream()
                        .mapToInt(Beat::getPlays)
                        .sum())
                .subscriptionStatus(false)
                .build();

        if (authUserId == null) return displayUserDto;

        if (findById(authUserId).getSubscriptions().stream()
                .anyMatch(u -> u == user)) displayUserDto.setSubscriptionStatus(true);

        return displayUserDto;
    }

    @Override
    public boolean subscribeAndUnsubscribe(String userId, String channelId) {
        User user = findById(userId);
        User channel = findById(channelId);

        for (User subscription : user.getSubscriptions()) {
            if (subscription == channel) {
                user.getSubscriptions().remove(subscription);
                userRepository.save(user);
                return false;
            }
        }

        user.getSubscriptions().add(channel);
        userRepository.save(user);

        return true;
    }
}
