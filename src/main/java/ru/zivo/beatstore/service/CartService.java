package ru.zivo.beatstore.service;

import ru.zivo.beatstore.web.dto.CartDto;

import java.util.List;

public interface CartService {

    List<CartDto> findCartByUserId(String userId);
}
