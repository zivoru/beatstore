package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.io.File;
import java.util.ArrayList;
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
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %d не найден".formatted(id)));
    }

    @Override
    public Page<Beat> getBeats(Long userId, Pageable pageable) {
        User user = findById(userId);

        List<Beat> beats = user.getBeats();

        return sortedPublishedBeats(beats, pageable);
    }

    @Override
    public Page<Purchased> getPurchasedBeats(Long userId, Pageable pageable) {
        User user = findById(userId);

        List<Purchased> purchased = user.getPurchased();

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), purchased.size());

        return new PageImpl<>(purchased.subList(start, end), pageable, purchased.size());
    }

    @Override
    public Page<Beat> getFavoriteBeats(Long userId, Pageable pageable) {
        User user = findById(userId);

        List<Beat> favorite = user.getFavorite();

        return sortedPublishedBeats(favorite, pageable);
    }

    @Override
    public Page<Beat> getHistoryBeats(Long userId, Pageable pageable) {
        User user = findById(userId);

        List<Beat> history = user.getHistory();

        return sortedPublishedBeats(history, pageable);
    }

    @Override
    public void delete(Long id) {

        User user = findById(id);

        List<Beat> beats = user.getBeats();

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

    @Override
    public List<User> getRecommendedUsers(Integer limit) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getSubscribers().size(), o1.getSubscribers().size()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public DisplayUserDto getDisplayUserDto(String username, Long authUserId) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Пользователь с username = %s не найден".formatted(username)));

        int amountPlays = 0;

        for (Beat beat : user.getBeats()) {
            amountPlays = amountPlays + beat.getPlays();
        }

        DisplayUserDto displayUserDto = DisplayUserDto.builder()
                .username(user.getUsername())
                .verified(user.getVerified())
                .profile(user.getProfile())
                .social(user.getSocial())
                .amountSubscribers(user.getSubscribers().size())
                .amountBeats(user.getBeats().size())
                .amountPlays(amountPlays)
                .subscriptionStatus(false)
                .build();

        if (authUserId == null) {
            return displayUserDto;
        }

        User authUser = findById(authUserId);

        for (User u : authUser.getSubscriptions()) {
            if (u == user) {
                displayUserDto.setSubscriptionStatus(true);
                break;
            }
        }

        return displayUserDto;
    }

    public Page<Beat> sortedPublishedBeats(List<Beat> beats, Pageable pageable) {
        List<Beat> publishedBeats = new ArrayList<>();

        for (Beat beat : beats) {
            if (beat.getStatus() == BeatStatus.PUBLISHED) {
                publishedBeats.add(beat);
            }
        }

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), publishedBeats.size());

        return new PageImpl<>(publishedBeats.subList(start, end), pageable, publishedBeats.size());
    }
}
