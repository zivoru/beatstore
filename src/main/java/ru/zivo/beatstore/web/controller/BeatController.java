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

    @Operation(summary = "Создание бита")
    @PostMapping("{userId}")
    public ResponseEntity<Long> create(@PathVariable Long userId, @RequestBody Beat beat) {
        Beat savedBeat = beatService.create(userId, beat);
        return ResponseEntity.ok(savedBeat.getId());
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

        Tag tag1 = new Tag();
        tag1.setTag(nameTag1);
        Tag tag2 = new Tag();
        tag2.setTag(nameTag2);
        Tag tag3 = new Tag();
        tag3.setTag(nameTag3);

        Tag createdTag1 = tagService.create(tag1);
        Tag createdTag2 = tagService.create(tag2);
        Tag createdTag3 = tagService.create(tag3);

        List<Tag> tags = new ArrayList<>();

        tags.add(createdTag1);
        tags.add(createdTag2);
        tags.add(createdTag3);

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
        List<Beat> beats = beatService.getTrendBeats(limit);

        return ResponseEntity.ok(beats);
    }

    @Operation(summary = "Получение топ чарт")
    @GetMapping("/top-charts")
    public ResponseEntity<Page<Beat>> getTopChart(@RequestParam(required = false) String nameFilter,
                                                  @RequestParam(required = false) Long[] tags,
                                                  @RequestParam(required = false) String[] genres,
                                                  @RequestParam(required = false) Integer priceMin,
                                                  @RequestParam(required = false) Integer priceMax,
                                                  @RequestParam(required = false) String key,
                                                  @RequestParam(required = false) Integer bpmMin,
                                                  @RequestParam(required = false) Integer bpmMax,
                                                  Pageable pageable
    ) {
        Page<Beat> beats = beatService.getTopChart(nameFilter, tags, genres, priceMin, priceMax, key, bpmMin, bpmMax, pageable);

        return ResponseEntity.ok(beats);
    }

    @Operation(summary = "Бит по id")
    @GetMapping("{id}")
    public ResponseEntity<Beat> findById(@PathVariable Long id) {
        return ResponseEntity.ok(beatService.findById(id));
    }

    @Operation(summary = "Добавление прослушивания бита")
    @PostMapping("plays/{beatId}")
    public void create(@PathVariable Long beatId) {
        beatService.addPlay(beatId);
    }

    @Operation(summary = "Добавление и удаление из избранного")
    @PostMapping("favorite/{beatId}/{userId}")
    public void addAndDeleteFavorite(@PathVariable Long beatId, @PathVariable Long userId) {
        beatService.addAndDeleteFavorite(beatId, userId);
    }

    @Operation(summary = "Добавление в корзину")
    @PostMapping("/user/{userId}/beat/{beatId}/license/{license}")
    public ResponseEntity<Cart> addToCart(@PathVariable Long userId, @PathVariable Long beatId, @PathVariable String license) {
        Cart cart = beatService.addToCart(userId, beatId, license);

        return ResponseEntity.ok(cart);
    }

    @Operation(summary = "Добавление в историю")
    @PostMapping("/user/{userId}/beat/{beatId}")
    public void getRecommendedUsers(@PathVariable Long userId, @PathVariable Long beatId) {
        beatService.addToHistory(userId, beatId);
    }

    @Operation(summary = "Удаление бита")
    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        beatService.delete(id);
    }
}