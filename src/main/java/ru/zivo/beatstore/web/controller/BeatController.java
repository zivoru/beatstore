package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.TagService;
import ru.zivo.beatstore.web.dto.BeatDto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequestMapping("api/v1/beats")
@RestController
public class BeatController {

    private final BeatService beatService;
    private final TagService tagService;

    @Autowired
    public BeatController(BeatService beatService, TagService tagService) {
        this.beatService = beatService;
        this.tagService = tagService;
    }

    @Operation(summary = "Бит по id")
    @GetMapping("{id}")
    public ResponseEntity<Beat> findById(@PathVariable Long id) {
        return ResponseEntity.ok(beatService.findById(id));
    }

    @Operation(summary = "Создание бита")
    @PostMapping()
    public ResponseEntity<Long> create(@AuthenticationPrincipal OAuth2User principal, @RequestBody Beat beat) {
        if (principal == null) return null;
        Beat savedBeat = beatService.create(principal.getAttribute("sub"), beat);
        return ResponseEntity.ok(savedBeat.getId());
    }

    @Operation(summary = "Изменение бита")
    @PutMapping("{id}")
    public ResponseEntity<Long> update(@AuthenticationPrincipal OAuth2User principal,
                                       @PathVariable Long id, @RequestBody Beat beat) {
        if (principal == null) return null;
        beatService.update(principal.getAttribute("sub"), id, beat);
        return ResponseEntity.ok(id);
    }

    @Operation(summary = "Удаление бита")
    @DeleteMapping("{id}")
    public void delete(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long id) {
        if (principal != null) beatService.delete(principal.getAttribute("sub"), id);
    }

    @Operation(summary = "Загрузка фото бита")
    @PostMapping("uploadImage/{beatId}")
    public void uploadImage(@PathVariable Long beatId,
                            @RequestParam(name = "image") MultipartFile image) throws IOException {
        beatService.uploadImage(beatId, image);
    }

    @Operation(summary = "Загрузка аудио бита")
    @PostMapping("uploadAudio/{beatId}")
    public ResponseEntity<Long> uploadAudio(
            @PathVariable Long beatId,
            @RequestParam(name = "mp3", required = false) MultipartFile mp3,
            @RequestParam(name = "wav", required = false) MultipartFile wav,
            @RequestParam(name = "zip", required = false) MultipartFile zip
    ) throws IOException {
        beatService.uploadAudio(beatId, mp3, wav, zip);
        return ResponseEntity.ok(beatId);
    }

    @Operation(summary = "Создание и добавление тегов")
    @PostMapping("createTag/{beatId}")
    public void createTag(@PathVariable Long beatId,
                          @RequestParam String nameTag1,
                          @RequestParam String nameTag2,
                          @RequestParam String nameTag3
    ) {
        List<Tag> tags = new ArrayList<>();

        tags.add(tagService.create(Tag.builder().name(nameTag1).build()));
        tags.add(tagService.create(Tag.builder().name(nameTag2).build()));
        tags.add(tagService.create(Tag.builder().name(nameTag3).build()));

        beatService.addTags(beatId, tags);
    }

    @Operation(summary = "Добавление лицензии")
    @PostMapping("createLicense/{beatId}")
    public void addLicense(@PathVariable Long beatId, @RequestBody License license) {
        beatService.addLicense(beatId, license);
    }

    @Operation(summary = "Получение трендовых битов")
    @GetMapping("trend-beats")
    public ResponseEntity<List<Beat>> getTrendBeats(@RequestParam Integer limit) {
        return ResponseEntity.ok(beatService.getTrendBeats(limit));
    }

    @Operation(summary = "Получение топ чарт")
    @GetMapping("top-charts")
    public ResponseEntity<Page<BeatDto>> getTopChart(@RequestParam(required = false) String nameFilter,
                                                     @RequestParam(required = false) Long tag,
                                                     @RequestParam(required = false) String genre,
                                                     @RequestParam(required = false) Integer priceMin,
                                                     @RequestParam(required = false) Integer priceMax,
                                                     @RequestParam(required = false) String key,
                                                     @RequestParam(required = false) String mood,
                                                     @RequestParam(required = false) Integer bpmMin,
                                                     @RequestParam(required = false) Integer bpmMax,
                                                     @AuthenticationPrincipal OAuth2User principal,
                                                     Pageable pageable
    ) {
        return ResponseEntity.ok(beatService.getTopChart(nameFilter, tag, genre, priceMin, priceMax, key,
                mood, bpmMin, bpmMax, principal != null ? principal.getAttribute("sub") : null, pageable));
    }

    @Operation(summary = "Добавление прослушивания бита")
    @PostMapping("plays/{beatId}")
    public void create(@PathVariable Long beatId) {
        beatService.addPlay(beatId);
    }

    @Operation(summary = "Добавление в избранное")
    @PostMapping("addToFavorite/{beatId}")
    public void addToFavorite(@PathVariable Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) beatService.addToFavorite(beatId, principal.getAttribute("sub"));
    }

    @Operation(summary = "Удаление из избранного")
    @PostMapping("removeFromFavorite/{beatId}")
    public void removeFromFavorite(@PathVariable Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) beatService.removeFromFavorite(beatId, principal.getAttribute("sub"));
    }

    @Operation(summary = "Добавление в корзину")
    @PostMapping("beat/{beatId}/license/{license}")
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal OAuth2User principal,
                                          @PathVariable Long beatId,
                                          @PathVariable String license) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.addToCart(principal.getAttribute("sub"), beatId, license));
    }

    @Operation(summary = "Удаление из корзины")
    @PostMapping("removeFromCart/beat/{beatId}")
    public void removeFromCart(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long beatId) {
        if (principal != null) beatService.removeFromCart(principal.getAttribute("sub"), beatId);
    }

    @Operation(summary = "Добавление в историю")
    @PostMapping("beat/{beatId}")
    public void getRecommendedUsers(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long beatId) {
        if (principal != null) beatService.addToHistory(principal.getAttribute("sub"), beatId);
    }

    @Operation(summary = "Избранные биты пользователя по его id")
    @GetMapping("favorite")
    public ResponseEntity<Page<BeatDto>> getFavorite(@AuthenticationPrincipal OAuth2User principal,
                                                     Pageable pageable) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.getFavoriteBeats(principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "История битов пользователя по его id")
    @GetMapping("history")
    public ResponseEntity<Page<BeatDto>> getHistory(@AuthenticationPrincipal OAuth2User principal,
                                                    Pageable pageable) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.getHistoryBeats(principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "Опубликованные биты пользователя по его id")
    @GetMapping("user/{userId}")
    public ResponseEntity<Page<BeatDto>> getBeats(@AuthenticationPrincipal OAuth2User principal,
                                                  @PathVariable String userId,
                                                  Pageable pageable) {
        return ResponseEntity.ok(beatService.getBeats(userId, principal == null ? null :
                principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "Черновики пользователя")
    @GetMapping("/drafts")
    public ResponseEntity<List<Beat>> getDrafts(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null : ResponseEntity.ok(beatService.getDrafts(principal.getAttribute("sub")));
    }

    @Operation(summary = "Проданные биты пользователя")
    @GetMapping("/sold")
    public ResponseEntity<List<Beat>> getSold(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null : ResponseEntity.ok(beatService.getSold(principal.getAttribute("sub")));
    }
}
