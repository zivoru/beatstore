package ru.zivo.beatstore.service;

import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.User;

import java.io.IOException;

public interface UserService {

    User register(Long userId, MultipartFile photo) throws IOException;

    User update(User user);

    User findById(Long id);

    void delete(Long id);
}
