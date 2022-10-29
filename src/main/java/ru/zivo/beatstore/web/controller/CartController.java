package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Корзина по id пользователя")
    @GetMapping
    public ResponseEntity<List<CartDto>> findCartByUserId(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null
                : ResponseEntity.ok(cartService.findAllByUserId(principal.getAttribute("sub")));
    }

    @Operation(summary = "Удаление элемента корзины")
    @DeleteMapping("{beatId}")
    public void delete(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long beatId) {
        if (principal != null) {
            cartService.delete(principal.getAttribute("sub"), beatId);
        }
    }

    @Operation(summary = "Удаление элементов корзины по id автора")
    @DeleteMapping("userId/{authorId}")
    public void deleteByUserId(@AuthenticationPrincipal OAuth2User principal, @PathVariable String authorId) {
        if (principal != null) {
            cartService.deleteByAuthorId(principal.getAttribute("sub"), authorId);
        }
    }
}
