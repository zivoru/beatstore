package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.Cart;

import java.util.List;

public interface CartService {

    List<Cart> findByUserId(Long userId);
}
