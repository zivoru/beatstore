package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.service.CartService;
import ru.zivo.beatstore.web.dto.CartDto;

import java.util.List;

@Tag(name = "CartController", description = "API для работы с корзинами")
@RequestMapping("api/v1/carts")
@RestController
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @Operation(summary = "Корзина по id пользователя")
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartDto>> findByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(cartService.findByUserId(userId));
    }
}
