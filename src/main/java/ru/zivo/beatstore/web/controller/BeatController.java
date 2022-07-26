package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("{userId}")
    public ResponseEntity<Long> create(@PathVariable String userId, @RequestBody Beat beat) {
        Beat savedBeat = beatService.create(userId, beat);
        return ResponseEntity.ok(savedBeat.getId());
    }

    @Operation(summary = "Изменение бита")
    @PutMapping("{id}")
    public void update(@PathVariable Long id, @RequestBody Beat beat) {
        beat.setId(id);
        beatService.update(beat);
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
            @RequestParam(name = "mp3") MultipartFile mp3,
            @RequestParam(name = "wav") MultipartFile wav,
            @RequestParam(name = "zip") MultipartFile zip
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
        List<Tag> tags = List.of(
                tagService.create(Tag.builder().name(nameTag1).build()),
                tagService.create(Tag.builder().name(nameTag2).build()),
                tagService.create(Tag.builder().name(nameTag3).build())
        );

        beatService.addTags(beatId, tags);
    }

    @Operation(summary = "Добавление лицензии")
    @PostMapping("createLicense/{beatId}")
    public void addLicense(@PathVariable Long beatId, @RequestBody License license) {
        beatService.addLicense(beatId, license);
    }

    @Operation(summary = "Получение трендовых битов")
    @GetMapping("/trend-beats")
    public ResponseEntity<List<Beat>> getTrendBeats(@RequestParam Integer limit) {
        return ResponseEntity.ok(beatService.getTrendBeats(limit));
    }

    @Operation(summary = "Получение топ чарт")
    @GetMapping("/top-charts")
    public ResponseEntity<Page<BeatDto>> getTopChart(@RequestParam(required = false) String nameFilter,
                                                     @RequestParam(required = false) Long tag,
                                                     @RequestParam(required = false) String genre,
                                                     @RequestParam(required = false) Integer priceMin,
                                                     @RequestParam(required = false) Integer priceMax,
                                                     @RequestParam(required = false) String key,
                                                     @RequestParam(required = false) String mood,
                                                     @RequestParam(required = false) Integer bpmMin,
                                                     @RequestParam(required = false) Integer bpmMax,
                                                     @RequestParam(required = false) String userId,
                                                     Pageable pageable
    ) {
        return ResponseEntity.ok(beatService.getTopChart(nameFilter, tag, genre, priceMin, priceMax, key, mood, bpmMin, bpmMax, userId, pageable));
    }

    @Operation(summary = "Добавление прослушивания бита")
    @PostMapping("plays/{beatId}")
    public void create(@PathVariable Long beatId) {
        beatService.addPlay(beatId);
    }

    @Operation(summary = "Добавление в избранное")
    @PostMapping("addToFavorite/{beatId}/{userId}")
    public void addToFavorite(@PathVariable Long beatId, @PathVariable String userId) {
        beatService.addToFavorite(beatId, userId);
    }

    @Operation(summary = "Удаление из избранного")
    @PostMapping("removeFromFavorite/{beatId}/{userId}")
    public void removeFromFavorite(@PathVariable Long beatId, @PathVariable String userId) {
        beatService.removeFromFavorite(beatId, userId);
    }

    @Operation(summary = "Добавление в корзину")
    @PostMapping("/user/{userId}/beat/{beatId}/license/{license}")
    public ResponseEntity<Cart> addToCart(@PathVariable String userId,
                                          @PathVariable Long beatId,
                                          @PathVariable String license) {
        return ResponseEntity.ok(beatService.addToCart(userId, beatId, license));
    }

    @Operation(summary = "Удаление из корзины")
    @PostMapping("removeFromCart/user/{userId}/beat/{beatId}")
    public void removeFromCart(@PathVariable String userId, @PathVariable Long beatId) {
        beatService.removeFromCart(userId, beatId);
    }

    @Operation(summary = "Добавление в историю")
    @PostMapping("/user/{userId}/beat/{beatId}")
    public void getRecommendedUsers(@PathVariable String userId, @PathVariable Long beatId) {
        beatService.addToHistory(userId, beatId);
    }

    @Operation(summary = "Удаление бита")
    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        beatService.delete(id);
    }

    @Operation(summary = "Избранные биты пользователя по его id")
    @GetMapping("/favorite/{userId}")
    public ResponseEntity<Page<BeatDto>> getFavorite(@PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(beatService.getFavoriteBeats(userId, pageable));
    }

    @Operation(summary = "История битов пользователя по его id")
    @GetMapping("/history/{userId}")
    public ResponseEntity<Page<BeatDto>> getHistory(@PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(beatService.getHistoryBeats(userId, pageable));
    }

    @Operation(summary = "Биты пользователя по его id")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BeatDto>> getBeats(@PathVariable String userId,
                                                  @RequestParam(required = false) String authUserId,
                                                  Pageable pageable) {
        return ResponseEntity.ok(beatService.getBeats(userId, authUserId, pageable));
    }
}
