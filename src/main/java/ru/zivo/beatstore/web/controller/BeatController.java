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
import ru.zivo.beatstore.model.filters.Filters;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.TagService;
import ru.zivo.beatstore.web.dto.BeatDto;
import ru.zivo.beatstore.web.dto.DisplayBeatDto;
import ru.zivo.beatstore.web.dto.LicenseDto;
import ru.zivo.beatstore.web.mapper.BeatMapper;
import ru.zivo.beatstore.web.mapper.LicenseMapper;

import java.io.IOException;
import java.util.List;

@RequestMapping("api/v1/beats")
@RestController
public class BeatController {

    private final BeatService beatService;
    private final TagService tagService;
    private final LicenseMapper licenseMapper;
    private final BeatMapper beatMapper;

    @Autowired
    public BeatController(BeatService beatService, TagService tagService, LicenseMapper licenseMapper, BeatMapper beatMapper) {
        this.beatService = beatService;
        this.tagService = tagService;
        this.licenseMapper = licenseMapper;
        this.beatMapper = beatMapper;
    }

    @Operation(summary = "Бит по id")
    @GetMapping("{id}")
    public ResponseEntity<Beat> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(beatService.findById(id));
    }

    @Operation(summary = "Дто бита по id")
    @GetMapping("dto/{id}")
    public ResponseEntity<DisplayBeatDto> findDtoById(@PathVariable("id") Long id,
                                                      @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(beatService.findDtoById(principal != null ? principal.getAttribute("sub") : null, id));
    }

    @Operation(summary = "Создание бита")
    @PostMapping
    public ResponseEntity<Long> create(@AuthenticationPrincipal OAuth2User principal, @RequestBody BeatDto beatDto) {
        if (principal == null) {
            return null;
        }
        Beat savedBeat = beatService.create(principal.getAttribute("sub"), beatMapper.toEntity(beatDto));
        return ResponseEntity.ok(savedBeat.getId());
    }

    @Operation(summary = "Изменение бита")
    @PutMapping("{id}")
    public ResponseEntity<Long> update(@PathVariable("id") Long id,
                                       @AuthenticationPrincipal OAuth2User principal,
                                       @RequestBody BeatDto beatDto) {
        if (principal == null) {
            return null;
        }
        beatService.update(principal.getAttribute("sub"), id, beatMapper.toEntity(beatDto));
        return ResponseEntity.ok(id);
    }

    @Operation(summary = "Публикация бита")
    @PutMapping("publication/{id}")
    public void publication(@PathVariable("id") Long id, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.publication(principal.getAttribute("sub"), id);
        }
    }

    @Operation(summary = "Удаление бита")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Long id, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.delete(principal.getAttribute("sub"), id);
        }
    }

    @Operation(summary = "Загрузка фото бита")
    @PostMapping("uploadImage/{beatId}")
    public void uploadImage(@PathVariable("beatId") Long beatId,
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
    public void createTag(@PathVariable("beatId") Long beatId,
                          @RequestParam("nameTag1") String nameTag1,
                          @RequestParam("nameTag2") String nameTag2,
                          @RequestParam("nameTag3") String nameTag3
    ) {
        beatService.addTags(beatId, tagService.create(Tag.ofName(nameTag1),
                Tag.ofName(nameTag2), Tag.ofName(nameTag3)));
    }

    @Operation(summary = "Добавление лицензии")
    @PostMapping("createLicense/{beatId}")
    public void addLicense(@PathVariable("beatId") Long beatId, @RequestBody LicenseDto licenseDto) {
        beatService.addLicense(beatId, licenseMapper.toEntity(licenseDto));
    }

    @Operation(summary = "Получение топ чарт")
    @GetMapping("top-charts")
    public ResponseEntity<Page<DisplayBeatDto>> getTopChart(@RequestParam(name = "nameFilter", required = false) String nameFilter,
                                                            @RequestParam(name = "tag", required = false) Long tag,
                                                            @RequestParam(name = "genre", required = false) String genre,
                                                            @RequestParam(name = "priceMin", required = false) Integer priceMin,
                                                            @RequestParam(name = "priceMax", required = false) Integer priceMax,
                                                            @RequestParam(name = "key", required = false) String key,
                                                            @RequestParam(name = "mood", required = false) String mood,
                                                            @RequestParam(name = "bpmMin", required = false) Integer bpmMin,
                                                            @RequestParam(name = "bpmMax", required = false) Integer bpmMax,
                                                            @AuthenticationPrincipal OAuth2User principal,
                                                            Pageable pageable
    ) {
        Filters filters = new Filters(tag, genre, priceMin, priceMax, key, mood, bpmMin, bpmMax);
        return ResponseEntity.ok(beatService.getTopChart(nameFilter, filters,
                principal != null ? principal.getAttribute("sub") : null, pageable));
    }

    @Operation(summary = "Добавление прослушивания бита")
    @PostMapping("plays/{beatId}")
    public void addPlay(@PathVariable("beatId") Long beatId) {
        beatService.addPlay(beatId);
    }

    @Operation(summary = "Добавление в избранное")
    @PostMapping("addToFavorite/{beatId}")
    public void addToFavorite(@PathVariable("beatId") Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.addToFavorite(beatId, principal.getAttribute("sub"));
        }
    }

    @Operation(summary = "Удаление из избранного")
    @PostMapping("removeFromFavorite/{beatId}")
    public void removeFromFavorite(@PathVariable("beatId") Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.removeFromFavorite(beatId, principal.getAttribute("sub"));
        }
    }

    @Operation(summary = "Добавление в корзину")
    @PostMapping("beat/{beatId}/license/{license}")
    public ResponseEntity<Cart> addToCart(@PathVariable("beatId") Long beatId,
                                          @PathVariable("license") String license,
                                          @AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.addToCart(principal.getAttribute("sub"), beatId, license));
    }

    @Operation(summary = "Удаление из корзины")
    @PostMapping("removeFromCart/beat/{beatId}")
    public void removeFromCart(@PathVariable("beatId") Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.removeFromCart(principal.getAttribute("sub"), beatId);
        }
    }

    @Operation(summary = "Добавление в историю")
    @PostMapping("beat/{beatId}")
    public void addToHistory(@PathVariable("beatId") Long beatId, @AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            beatService.addToHistory(principal.getAttribute("sub"), beatId);
        }
    }

    @Operation(summary = "Избранные биты пользователя")
    @GetMapping("favorite")
    public ResponseEntity<Page<DisplayBeatDto>> getFavorite(@AuthenticationPrincipal OAuth2User principal,
                                                            Pageable pageable) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.getFavoriteBeats(principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "История битов пользователя")
    @GetMapping("history")
    public ResponseEntity<Page<DisplayBeatDto>> getHistory(@AuthenticationPrincipal OAuth2User principal,
                                                           Pageable pageable) {
        return principal == null ? null :
                ResponseEntity.ok(beatService.getHistoryBeats(principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "Опубликованные биты пользователя")
    @GetMapping("user/{userId}")
    public ResponseEntity<Page<DisplayBeatDto>> getBeats(@PathVariable String userId,
                                                         @AuthenticationPrincipal OAuth2User principal,
                                                         Pageable pageable) {
        return ResponseEntity.ok(beatService.getBeats(userId, principal == null ? null :
                principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "Черновики пользователя")
    @GetMapping("drafts")
    public ResponseEntity<List<Beat>> getDrafts(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null : ResponseEntity.ok(beatService.getDrafts(principal.getAttribute("sub")));
    }

    @Operation(summary = "Проданные биты пользователя")
    @GetMapping("sold")
    public ResponseEntity<List<Beat>> getSold(@AuthenticationPrincipal OAuth2User principal) {
        return principal == null ? null : ResponseEntity.ok(beatService.getSold(principal.getAttribute("sub")));
    }

    @Operation(summary = "Получение похожих битов")
    @GetMapping("similar-beats/{beatId}")
    public ResponseEntity<List<Beat>> getSimilarBeats(@PathVariable("beatId") Long beatId,
                                                      @RequestParam("limit") Integer limit) {
        return ResponseEntity.ok(beatService.getSimilarBeats(beatId, limit));
    }

    @Operation(summary = "Бесплатные биты")
    @GetMapping("free-beats")
    public ResponseEntity<Page<DisplayBeatDto>> getFreeBeats(@AuthenticationPrincipal OAuth2User principal,
                                                             Pageable pageable) {
        return ResponseEntity.ok(beatService.getFreeBeats(principal == null ? null :
                principal.getAttribute("sub"), pageable));
    }

    @Operation(summary = "Страница битов по жанру")
    @GetMapping("findAllByGenre/{genre}")
    public ResponseEntity<Page<DisplayBeatDto>> findAllByGenre(@AuthenticationPrincipal OAuth2User principal,
                                                               @PathVariable String genre,
                                                               Pageable pageable) {
        return ResponseEntity.ok(beatService.findAllByGenre(principal == null ? null :
                principal.getAttribute("sub"), genre, pageable));
    }

    @Operation(summary = "Страница битов по тэгу")
    @GetMapping("findAllByTag/{tagId}")
    public ResponseEntity<Page<DisplayBeatDto>> findAllByTag(@PathVariable("tagId") Long tagId,
                                                             @AuthenticationPrincipal OAuth2User principal,
                                                             Pageable pageable) {
        return ResponseEntity.ok(beatService.findAllByTag(principal == null ? null :
                principal.getAttribute("sub"), tagId, pageable));
    }
}