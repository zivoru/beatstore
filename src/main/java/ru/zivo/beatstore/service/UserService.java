package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {

    User register();

    User update(User user);

    User findById(Long id);

    Page<Beat> getBeats(Long userId, Pageable pageable);

    List<Cart> getCart(Long userId);

    Page<Purchased> getPurchasedBeats(Long userId, Pageable pageable);

    Page<Beat> getFavoriteBeats(Long userId, Pageable pageable);

    Page<Beat> getHistoryBeats(Long userId, Pageable pageable);

    void delete(Long id);

    List<User> getRecommendedUsers(Integer limit);

    User findByUsername(String username);
}
