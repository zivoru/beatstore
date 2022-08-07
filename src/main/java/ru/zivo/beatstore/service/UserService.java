package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.util.List;

public interface UserService {

    User register(String id, String username, String email);

    User update(String id, String username, String email);

    User findById(String id);

    void delete(String id);

    List<User> getRecommended(Integer limit);

    DisplayUserDto getDisplayUserDto(String username, String authUserId);

    boolean subscribeAndUnsubscribe(String userId, String channelId);

    Page<User> findAll(Pageable pageable, String nameFilter);

    Boolean findByUsername(String username);
}
