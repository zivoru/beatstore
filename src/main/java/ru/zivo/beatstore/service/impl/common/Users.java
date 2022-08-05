package ru.zivo.beatstore.service.impl.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.UserRepository;

@Component
public class Users {

    private static UserRepository userRepository;

    @Autowired
    public Users(UserRepository userRepository) {
        Users.userRepository = userRepository;
    }

    public static User getUser(String userId) {
        return userId == null ? null : userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь с id = %s не найден".formatted(userId)));
    }
}
