package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.Social;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Status;
import ru.zivo.beatstore.repository.ProfileRepository;
import ru.zivo.beatstore.repository.SocialRepository;
import ru.zivo.beatstore.repository.UserRepository;
import ru.zivo.beatstore.service.UserService;
import ru.zivo.beatstore.service.impl.common.DeleteFiles;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.nio.file.Path;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final String uploadPath;

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final SocialRepository socialRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, ProfileRepository profileRepository,
                           SocialRepository socialRepository, BeatstoreProperties beatstoreProperties) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.socialRepository = socialRepository;
        this.uploadPath = beatstoreProperties.getUploadPath();
    }

    @Override
    public User register(String id, String username, String email) {
        StringBuilder newUsername = new StringBuilder();

        for (int i = 0; i < username.length(); i++) {
            if (username.charAt(i) != ' ') {
                newUsername.append(username.charAt(i));
            }
        }

        String name = String.valueOf(newUsername).toLowerCase();

        boolean check = name.equals("feed") || name.equals("genres") || name.equals("playlists")
                        || name.equals("beatmakers") || name.equals("beat") || name.equals("top-charts")
                        || name.equals("playlist") || name.equals("genre") || name.equals("tag")
                        || name.equals("free-beats") || name.equals("cart") || name.equals("edit")
                        || name.equals("upload-beat") || name.equals("beats") || name.equals("my-playlists")
                        || name.equals("history") || name.equals("favorites") || name.equals("settings");

        if (findByUsername(name) || check) {
            for (int i = 1; i < 20; i++) {
                if (!findByUsername(name + i)) {
                    newUsername.append(i);
                    break;
                }
            }
        }

        User user = User.builder()
                .id(id)
                .username(String.valueOf(newUsername).toLowerCase())
                .email(email)
                .verified(false)
                .status(Status.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setDisplayName(username);
        profile.setImageName("");
        profile.setUser(savedUser);
        profileRepository.save(profile);

        Social social = new Social();
        social.setUser(savedUser);
        socialRepository.save(social);

        savedUser.setProfile(profile);
        savedUser.setSocial(social);

        return userRepository.save(savedUser);
    }

    @Override
    public User update(String id, String username, String email) {
        if (username == null || email == null) {
            throw new IllegalArgumentException("username or email is null");
        }
        User user = findById(id);
        user.setUsername(username);
        user.setEmail(email);
        return userRepository.save(user);
    }

    @Override
    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %s не найден".formatted(id)));
    }

    @Override
    public boolean findByUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("username is null");
        }
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    @Transactional
    public void delete(String id) {
        User user = findById(id);

        List<Beat> beats = user.getBeats();

        String s = "/user-" + id;

        if (!beats.isEmpty()) {
            for (Beat beat : beats) {
                String pathname = uploadPath + s + "/beats" + "/beat-" + beat.getId();

                DeleteFiles.delete(beat, pathname);
                DeleteFiles.deleteFile(Path.of(pathname));
            }
        }

        DeleteFiles.deleteFile(Path.of(uploadPath + s + "/beats"));
        DeleteFiles.deleteFile(Path.of(uploadPath + s));

        userRepository.delete(user);
    }

    @Override
    public List<User> getRecommended(Integer limit) {
        if (limit == null) {
            throw new IllegalArgumentException("limit is null");
        }
        return userRepository.findAll()
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getSubscribers().size(), o1.getSubscribers().size()))
                .limit(limit)
                .toList();
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

        if (authUserId == null) {
            return displayUserDto;
        }

        if (findById(authUserId).getSubscriptions().stream().anyMatch(u -> u == user)) {
            displayUserDto.setSubscriptionStatus(true);
        }

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

    @Override
    public Page<User> findAll(Pageable pageable, String nameFilter) {
        if (pageable == null) {
            throw new IllegalArgumentException("pageable is null");
        }
        return nameFilter != null
                ? userRepository.findAllByUsernameContainsIgnoreCase(pageable, nameFilter)
                : userRepository.findAll(pageable);
    }
}
