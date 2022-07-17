package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.web.dto.DisplayUserDto;

import java.util.List;

public interface UserService {

    User register();

    User update(User user);

    User findById(Long id);

    Page<Beat> getBeats(Long userId, Pageable pageable);

    Page<Purchased> getPurchasedBeats(Long userId, Pageable pageable);

    Page<Beat> getFavoriteBeats(Long userId, Pageable pageable);

    Page<Beat> getHistoryBeats(Long userId, Pageable pageable);

    void delete(Long id);

    List<User> getRecommended(Integer limit);

    DisplayUserDto getDisplayUserDto(String username, Long authUserId);
}
