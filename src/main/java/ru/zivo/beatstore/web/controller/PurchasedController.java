package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.service.PurchasedService;

@Tag(name = "PurchasedController", description = "API для работы с покупками")
@RequestMapping("api/v1/purchased")
@RestController
public class PurchasedController {

    private final PurchasedService purchasedService;

    @Autowired
    public PurchasedController(PurchasedService purchasedService) {
        this.purchasedService = purchasedService;
    }

    @Operation(summary = "Купленные пользователя по его id")
    @GetMapping("/{userId}")
    public ResponseEntity<Page<Purchased>> getPurchased(@PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(purchasedService.getPurchasedBeats(userId, pageable));
    }
}
