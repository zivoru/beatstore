package ru.zivo.beatstore.service;

import ru.zivo.beatstore.web.dto.CartDto;

import java.util.List;

public interface CartService {

    List<CartDto> findAllByUserId(String userId);

    void delete(String authUserId, Long beatId);

    void deleteByAuthorId(String authUserId, String authorId);
}
