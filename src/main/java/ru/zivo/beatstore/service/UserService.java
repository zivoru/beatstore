package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.util.List;

public interface UserService {

    User register();

    User update(User user);

    User findById(String id);

    void delete(String id);

    List<User> getRecommended(Integer limit);

    DisplayUserDto getDisplayUserDto(String username, String authUserId);

    boolean subscribeAndUnsubscribe(String userId, String channelId);
}
