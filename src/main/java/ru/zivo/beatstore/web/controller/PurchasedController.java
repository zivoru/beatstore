package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.service.PurchasedService;

import java.util.List;

@Tag(name = "PurchasedController", description = "API для работы с покупками")
@RequestMapping("api/v1/purchased")
@RestController
public class PurchasedController {

    private final PurchasedService purchasedService;

    @Autowired
    public PurchasedController(PurchasedService purchasedService) {
        this.purchasedService = purchasedService;
    }

    @Operation(summary = "Купленные биты пользователя")
    @GetMapping
    public ResponseEntity<List<Purchased>> getPurchased(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null :
                ResponseEntity.ok(purchasedService.getPurchasedBeats(principal.getAttribute("sub")));
    }
}
