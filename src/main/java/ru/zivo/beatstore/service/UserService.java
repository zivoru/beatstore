package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.util.List;

public interface UserService {

    User register();

    User update(User user);

    User findById(Long id);

    void delete(Long id);

    List<User> getRecommended(Integer limit);

    DisplayUserDto getDisplayUserDto(String username, Long authUserId);

    void subscribeAndUnsubscribe(Long userId, Long channelId);
}
