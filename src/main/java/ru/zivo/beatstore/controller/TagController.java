package ru.zivo.beatstore.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.service.TagService;

import java.util.List;

@RequestMapping("api/v1/tags")
@RestController
public class TagController {

    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "Получение трендовых тегов")
    @GetMapping("/trend-tags")
    public ResponseEntity<List<Tag>> getTrendTags(@RequestParam Integer limit) {
        List<Tag> tags = tagService.getTrendTags(limit);

        return ResponseEntity.ok(tags);
    }

    @Operation(summary = "Получение тегов")
    @GetMapping
    public ResponseEntity<Page<Tag>> getTrendTags(@RequestParam(required = false) String nameFilter, Pageable pageable) {
        Page<Tag> tags = tagService.getPageTags(nameFilter, pageable);

        return ResponseEntity.ok(tags);
    }
}
