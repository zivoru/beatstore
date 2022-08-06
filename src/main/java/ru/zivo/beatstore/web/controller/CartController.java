package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
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
    @GetMapping("/")
    public ResponseEntity<List<CartDto>> findCartByUserId(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null :
                ResponseEntity.ok(cartService.findCartByUserId(principal.getAttribute("sub")));
    }

    @Operation(summary = "Удаление элемента корзины")
    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long id) {
        if (principal != null) cartService.delete(principal.getAttribute("sub"), id);
    }

    @Operation(summary = "Удаление элементов корзины по id пользователя")
    @DeleteMapping("/userId/{userId}")
    public void deleteByUserId(@AuthenticationPrincipal OAuth2User principal, @PathVariable String userId) {
        if (principal != null) cartService.deleteByUserId(principal.getAttribute("sub"), userId);
    }
}
