package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @Operation(summary = "Получение тега по id")
    @GetMapping("{id}")
    public ResponseEntity<Tag> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.findById(id));
    }

    @Operation(summary = "Получение трендовых тегов")
    @GetMapping("trend-tags")
    public ResponseEntity<List<Tag>> getTrendTags(@RequestParam Integer limit) {
        return ResponseEntity.ok(tagService.getTrendTags(limit));
    }

    @Operation(summary = "Получение тегов")
    @GetMapping
    public ResponseEntity<Page<Tag>> getTrendTags(@RequestParam(required = false) String nameFilter, Pageable pageable) {
        return ResponseEntity.ok(tagService.getPageTags(nameFilter, pageable));
    }
}
